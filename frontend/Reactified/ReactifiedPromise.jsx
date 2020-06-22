export default () => {
	const DefaultErrorSign = ({error}) => <div className="error">{error.message}</div>;
	const DefaultLoading   = ()        => <div className="loading" />;

	const DefaultPromiseRenderer = class PromiseReactRenderer extends React.PureComponent {
		@prop promise;

		@state result = VOID;
		@state error;

		// state = {};

		isCancelled = false;

		constructor() {
			super(...arguments);

			this.id = idCounter++;
		}

		async componentDidMount() {
			try {
				let result = await this.promise;

				if(this.isCancelled == false) {
					this.result = result;
				}
			} catch(error) {
				this.error = error;
			}

			this.commitState();
		}

		componentWillUnmount() {
			this.isCancelled = true;
		}

		render() {
			if(this.error) {
				return <ErrorSign error={this.error} />;
			}

			if(this.result === VOID) {
				return <Loading />;
			}

			return empty(this.result) ? '' : this.result;
		}
	};

	/**
	 *
	 * @type {{ErrorSign,Loading,PromiseRendererGenerator,Link}}
	 */
	global.Reactified = global.Reactified || {};

	const optionalCallback = x => x || (x=>x);

	const ErrorSign = optionalCallback(Reactified.ErrorSign)(DefaultErrorSign);
	const Loading   = optionalCallback(Reactified.Loading)(DefaultLoading);
	const PromiseRenderer = optionalCallback(Reactified.PromiseRenderer)(DefaultPromiseRenderer);

	let idCounter = 1;
	let VOID = { $symbol:'VOID' };

	const processedPrototypes = [];

	for(const PromisePrototype of [Promise.prototype, Bluebird.prototype]) {
		if(processedPrototypes.has(PromisePrototype)) {
			continue;
		}

		Object.defineProperty(PromisePrototype, '@@iterator', {
			enumerable: false,
			value: function*() {
				yield <___ key={this}>{this.toReact()}</___>;
			}
		});

		Object.defineProperty(PromisePrototype, 'toReact', {
			enumerable: false,
			value() {
				if(this.isFulfilled()) {
					return this.value();
				}
				// console.warn('Not fulfilled promise', this);
				return <PromiseRenderer promise={this} />;
			}
		});

		processedPrototypes.push(PromisePrototype);
	}
}