import JsxReactUtils from "../../../base/JsxReactUtils";
import reactUseNewLifecycle from "../../Helpers/reactUseNewLifecycle";
import ContextConsumerFn from "./ContextConsumer";

/**
 * @typedef ReactComponentContext {(Context | React.Context<ReactComponent.CreateContext.props>)&{ReactComponent,Container}}
 */
export default () => {
	const React = JsxReactUtils.dependency("react");
	const cssNamespace = JsxReactUtils.config('cssNamespace');

	// Declaration is prefixed with `false || ` because this is the cleanest way I came up with
	// to make PHPStorm understand this global class declaration in function.
	// Maybe there's a way to do this with jsDoc.

	/**
	 * Base component class in "jsx-react-utils"
	 *
	 * @type {{new(...[*]): ReactComponent,prototype: ReactComponent}}
	 * @alias ReactComponent
	 */
	global.ReactComponent = false || class ReactComponent extends React.Component {
		//<editor-fold defaultstate="collapsed" desc="# Context">
		/**
		 * @param defaultValue {*}
		 * @param extend {{(typeof ContextConsumer$Implementation):typeof ContextConsumer$Implementation}}
		 * @return {ReactComponentContext}
		 */
		static CreateContext(defaultValue, extend = x => x) {
			/** @type {ReactComponentContext} */
			const Context = React.createContext(defaultValue);
			const ContextConsumer = JsxReactUtils.component("ContextConsumer", ContextConsumerFn);

			Context.ReactComponent = extend(class ContextConsumer$Implementation extends ContextConsumer {
				static CssClasses = [];

				static get Context() {
					return Context;
				}

				static get ContextConsumer() {
					return this.Context['Consumer'];
				}

				get contextContainer() {
					return this.consumedContext.target;
				}
			});

			Context.Container = ({target, ...props}) => {
				const {stateHash} = target;
				return <Context.Provider value={{stateHash, target}} {...props} />
			};

			return Context;
		}
		//</editor-fold>
		//<editor-fold defaultstate="collapsed" desc="# Properties">
		@state isAsyncReady = true;

		ref = {};

		/** @type {Bluebird|Promise} */
		asyncPromise = null;

		_rootRef = React.createRef();
		_traits = [];
		_subscriptions = [];
		_willUnmount = false;
		_updateSnapshot = {};
		//</editor-fold>

		constructor(...args) {
			super(...args);

			this._wrapLifecycleMethods();
			this._initializeRefs();
			this._initializeTraits();
			this._defineInitialState();
			this._handleAsyncPrepare();

			this.componentWillInit();
		}

		//<editor-fold defaultstate="collapsed" desc="# Getters">
		/**
		 * Returns all constructor names of this component's prototype chain (including traits)
		 * @return {String[]}
		 */
		get componentNames() {
			let obj = this.constructor.prototype;
			let names = [];

			while(obj) {
				let classes = [obj.constructor.name];

				if(Object.getOwnPropertyNames(obj.constructor).has('CssClasses')) {
					classes = obj.constructor.CssClasses;
				}

				names = names.concat(classes);

				obj = Object.getPrototypeOf(obj);

				if(!obj.constructor || !obj.constructor.name || obj.constructor == ReactComponent) {
					break;
				}
			}

			for(const trait of this._traits) {
				names = names.concat(trait.constructor.name);
			}

			return names;
		};

		/** @type String[] */
		get additionalClasses() { return []; }

		get style() {
			return { style: this.props && this.props.style }
		}

		/**
		 * Ref to root element (with `{...this.cls}` props)
		 * @return {Element}
		 */
		get rootRef() {
			return this._rootRef && this._rootRef.current;
		}

		/**
		 * If true, ReactComponent will populate `rootRef` reference with root element
		 * By default, `rootRef` if populated only if component has traits attached.
		 * @return {boolean}
		 */
		get useInternalRef() {
			return this._traits.length > 0;
		}

		get traitProps() {
			const result = {};

			for(const trait of this._traits) {
				const props = trait.rootProps;

				for(const prop of keys(props)) {
					result[prop] = this.mergeTraitProp(prop, props[prop], result[prop]);
				}
			}

			return result;
		}

		get computedCls() {
			return this.rootProps().className;
		}

		get cls() {
			return this.rootProps();
		}

		get updateSnapshot() {
			return this._updateSnapshot;
		}
		//</editor-fold>
		//<editor-fold defaultstate="collapsed" desc="# Public methods">
		rootClassName(additionalClasses = []) {
			/**
			 * Converts component name (e.g. `SomeComponent`) into '{cssNamespace}-some-component' string
			 *
			 * @param name
			 * @return {String}
			 */
			const componentNameToCssClass = name => `${cssNamespace}-${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

			/**
			 * Converts conditional class (e.g. `{myCls: this.isMyClsEnabled}`) into 'js--myCls' string
			 * - Get array of enabled classes mixed with falsy values instead of disabled classes
			 * - Filter falsy values
			 * - Join remaining classes into a string
			 *
			 * @param cls
			 * @return {String}
			 */
			const compileConditionalCssClass = cls => {
				if(valueType(cls) != Object) {
					return cls;
				}

				return keys(cls).map(key => cls[key] && `js--${key}`).exceptEmpty().join(' ');
			};

			// All CSS-classes from prototype chain
			const componentNameClasses = this.componentNames.map(componentNameToCssClass);

			// Additional and custom classes
			additionalClasses = this.additionalClasses.concat(additionalClasses).map(compileConditionalCssClass);

			// Add className prop
			if(this.props?.className) {
				additionalClasses.push(this.props.className);
			}

			// Add MaterialUI's classes if present
			if(this.props?.classes?.root) {
				/** @typedef {{classes:{root}}} MaterialUIReactProps */
				additionalClasses.push(this.props.classes.root);
			}

			return (
				[cssNamespace, ...componentNameClasses, ...additionalClasses]
					.exceptEmpty()       // Remove empty
					.unique()            // Remove duplicates
					.join(' ')           // Join everything
					.replace(/\s+/, ' ') // Collapse spaces
					.trim()              // Trim result
			);
		}

		rootProps(additionalClasses = []) {
			return {
				className: this.rootClassName(additionalClasses),
				...this.traitProps,

				...this.useInternalRef && {
					_internalRef: this._rootRef
				},
			};
		}

		mergeTraitProp(propName, nextValue, prevValue) {
			// No previous value, nothing to merge with
			if(!prevValue) {
				return nextValue;
			}

			// Merge className
			if(propName == 'className') {
				return [prevValue, nextValue].exceptEmpty().join(' ');
			}

			// Merge events and `ref` prop
			if(/^on[A-Z]/.test(propName) || propName == 'ref') {
				if(propName == 'ref') {
					if(valueType(prevValue) == Object) {
						const refObject = prevValue;
						prevValue = e => refObject.current = e;
					}

					if(valueType(nextValue) == Object) {
						const refObject = nextValue;
						nextValue = e => refObject.current = e;
					}
				}

				return function() {
					prevValue.apply(this, arguments);
					nextValue.apply(this, arguments);
				};
			}

			// Unknown prop, don't know how to merge
			return nextValue;
		}

		withCls(additional = []) {
			return this.rootProps(additional);
		}

		subscribe(observable, handler = null, showWarnings = true) {
			if(!isObservable(observable)) {
				console.warn('Value you\'re passed to subscribe() is not an observable');
				return;
			}

			if(!handler) {
				if(this[observable.$$name]) {
					handler = (...args) => this[observable.$$name](...args);
				} else {
					if(showWarnings) {
						console.warn(`No handler was provided or found for subscribing to ${observable.$$name} in ${this.constructor.name}`);
					}

					handler = () => {};
				}
			}

			this._subscriptions.push(observable(handler));
		}

		softSubscribe(observable, handler = null) {
			return this.subscribe(observable, handler, false);
		}

		subscribeProps(observable) {
			if(!isObservable(observable)) {
				console.warn('Value you\'re passed to subscribeProps() is not an observable');
				return;
			}

			if(observable.$$name in this.props) {
				this.subscribe(observable, this.props[observable.$$name]);
			}
		}

		subscribeToProp(observable) {
			if(!isObservable(observable)) {
				console.warn('Value you\'re passed to subscribeToProp() is not an observable');
				return;
			}

			if(this[observable.$$name]) {
				this.subscribe(observable, this[observable.$$name]);
			}
		}

		triggerTraitLifecycleMethod(method, container, ...args) {
			for(const trait of this._traits) {
				trait[method].apply(trait, [container, ...args]);
			}
		}

		createRef(name, skipProperty = false) {
			if(name in this.ref) {
				console.warn('Attempting to rewrite ref ', name, 'in', this);
				return;
			}

			this.ref[name] = React.createRef();

			if(!skipProperty) {
				Object.defineProperty(this, name, {
					configurable: true,
					get() {
						return this.ref[name].current;
					}
				});
			}

			return this.ref[name];
		}
		//</editor-fold>
		//<editor-fold defaultstate="collapsed" desc="# Private methods">
		/** @private */
		_internalComponentWillInit() {
			this.triggerTraitLifecycleMethod('componentWillInit', this);
		}

		/** @private */
		_internalComponentWillMount() {
			this.triggerTraitLifecycleMethod('componentWillMount', this);
		}

		/** @private */
		_internalComponentDidMount() {
			this.triggerTraitLifecycleMethod('componentDidMount', this);
		}

		/** @private */
		_internalComponentDidPrepare() {
			this.triggerTraitLifecycleMethod('componentDidPrepare', this);
		}

		/** @private */
		_internalComponentWillUnmount() {
			this.triggerTraitLifecycleMethod('componentWillUnmount', this);

			this._willUnmount = true;

			if(this.asyncPromise) {
				this.asyncPromise.cancel();
				this.asyncPromise = null;
			}

			for(const unsubscribeFn of this._subscriptions) {
				unsubscribeFn();
			}
		}

		/** @private */
		_callPrepare() {
			return this.prepare();
		}

		/** @private */
		_handleAsyncPrepare() {
			this.asyncPromise = this._callPrepare();

			if(this.asyncPromise instanceof Function) {
				this.asyncPromise = this.asyncPromise();
			}

			if(isPromise(this.asyncPromise) == false) {
				this.asyncPromise = null;
				setTimeout(() => this.componentDidPrepare(), 0);
				return;
			}

			this.isAsyncReady = false;

			// If prepare() returns a promise (so it was overriden with `async` modifier)
			// then keep it and schedule update when it's done
			this.asyncPromise.then(() => {
				this.isAsyncReady = true;
				this.asyncPromise = null;
				setTimeout(() => this.componentDidPrepare(), 0);
			});

			// Replace actual render() function with it's async wrapper
			const actualRender = this.render;
			this.render = function fakeRender() {
				// noinspection JSPotentiallyInvalidUsageOfClassThis
				if(this.isAsyncReady == false) {
					// noinspection JSPotentiallyInvalidUsageOfClassThis
					return this.renderAsyncLoader();
				}

				return actualRender.apply(this, arguments);
			};
		}

		/** @private */
		_defineInitialState() {
			this.state = this.getInitialState();

			if(this.props && this.props['initialState']) {
				this.state = this.props['initialState'];
			}
		}

		/** @private */
		_wrapMethod(methodName, beforeCall = null, afterCall = null, callerGenerator = null) {
			beforeCall = beforeCall || (() => {});
			afterCall = afterCall || (() => {});

			let originalCall = this[methodName];

			if(!originalCall) {
				console.warn(`_wrapMethod() target ${methodName} does not exist`);
				originalCall = () => {
				};
			}

			if(!callerGenerator) {
				callerGenerator = (beforeCall, originalCall, afterCall) => {
					return function() {
						beforeCall.apply(this, arguments);
						const result = originalCall.apply(this, arguments);
						afterCall.apply(this, arguments);
						return result;
					}
				}
			}

			this[methodName] = callerGenerator(beforeCall, originalCall, afterCall);
		}

		/** @private */
		_wrapLifecycleMethods() {
			let methods = {
				// Custom lifecycle
				componentWillInit: '_internalComponentWillInit',

				// New lifecycle methods
				getSnapshotBeforeUpdate: '_internalGetSnapshotBeforeUpdate',

				// Old lifecycle methods
				componentWillMount: '_internalComponentWillMount',
				componentWillReceiveProps: '_internalComponentWillReceiveProps',
				componentWillUpdate: '_internalComponentWillUpdate',

				// Common lifecycle
				componentDidMount: '_internalComponentDidMount',
				componentDidPrepare: '_internalComponentDidPrepare',
				componentDidUpdate: {
					overrideName: '_internalComponentDidUpdate',
					callGenerator(beforeCall, originalCall, afterCall) {
						return function() {
							// noinspection JSPotentiallyInvalidUsageOfClassThis
							const snapshot = this._updateSnapshot;
							// noinspection JSPotentiallyInvalidUsageOfClassThis
							this._updateSnapshot = {};

							const args = [...arguments];
							args[2] = snapshot;

							beforeCall.apply(this, args);
							const result = originalCall.apply(this, args);
							afterCall.apply(this, args);
							return result;
						}
					}
				},
				componentWillUnmount: '_internalComponentWillUnmount',
			};

			if(reactUseNewLifecycle(React)) {
				delete methods.componentWillMount;
				delete methods.componentWillReceiveProps;
				delete methods.componentWillUpdate;
			} else {
				delete methods.getSnapshotBeforeUpdate;
			}

			for(let methodName of keys(methods)) {
				let method = methods[methodName];
				let callGenerator = null;

				if(valueType(method) == Object) {
					callGenerator = method.callGenerator;
					method = method.overrideName;
				}

				this._wrapMethod(methodName, null, this[method], callGenerator);
			}
		}

		/** @private */
		_initializeRefs() {
			if(!this.constructor.Refs) {
				return;
			}

			for(const refName of this.constructor.Refs) {
				this.createRef(refName);
			}
		}

		/** @private */
		_initializeTraits() {
			if(!this.constructor.Traits) {
				return;
			}

			for(const {Trait, settings} of this.constructor.Traits) {
				this._traits.push(new Trait(this, settings));
			}
		}
		//</editor-fold>
		//<editor-fold defaultstate="collapsed" desc="# Lifecycle methods">
		static getDerivedStateFromProps(props, state) {
			return state;
		}

		getInitialState() {
			return {};
		}

		componentWillInit() {}
		componentDidMount() {}
		componentDidPrepare() {}
		componentDidUpdate() {}
		componentWillUnmount() {}

		shouldComponentUpdate(nextProps, nextState) {
			return Object.equal(this.props, nextProps) == false || Object.equal(this.state, nextState) == false;
		}

		/**
		 * Renders preloader while `prepare()` method promise is not resolved
		 * @return {*}
		 */
		renderAsyncLoader() {
			return <div className={`${cssNamespace} ${cssNamespace}-block-loader`} />;
		}

		/**
		 * This method is called in constructor before `componentWillInit()`. If it returns a promise, component will
		 * render preloader (using `renderAsyncLoader()` method) until the promise is resolved.
		 *
		 * Note that the base version of `prepare()` is synchronous.
		 * It can be overriden with async version and ReactComponent will handle the rest.
		 *
		 * @return {Bluebird|Promise|void}
		 */
		prepare() {
		}

		render() {
			return '[ no render() ]';
		}
		//</editor-fold>
	};

	if(reactUseNewLifecycle(React)) {
		ReactComponent.prototype.getSnapshotBeforeUpdate = function getSnapshotBeforeUpdate() {
			return null;
		};
	} else {
		// noinspection JSDeprecatedSymbols
		ReactComponent.prototype.componentWillMount = function componentWillMount() {};
		// noinspection JSDeprecatedSymbols
		ReactComponent.prototype.componentWillReceiveProps = function componentWillReceiveProps() {};
		// noinspection JSDeprecatedSymbols
		ReactComponent.prototype.componentWillUpdate = function componentWillUpdate() {};
	}
	return ReactComponent;
}