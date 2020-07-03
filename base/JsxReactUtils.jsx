export default class JsxReactUtils {
	// Symbols
	static AUTO_RESOLVE = {$symbol: 'JRU_AUTO_RESOLVE'};

	// Flags
	static isBluebirdAvailable = undefined;

	// Static
	static _instance;

	static get instance() {
		if(!this._instance) {
			this._instance = new this;
		}

		return this._instance;
	}

	static addConfig(...args) {
		return this.instance.addConfig(...args);
	}

	static registerComponent(name, implementationFn) {
		return this.addConfig({
			components: {
				[name]: implementationFn
			},
		});
	}

	static require(...args) {
		return this.instance.require(...args);
	}

	static dependency(...args) {
		return this.instance.dependency(...args);
	}

	static component(...args) {
		return this.instance.component(...args);
	}

	static config(...args) {
		return this.instance.config(...args);
	}

	static init(...args) {
		return this.instance.init(...args);
	}

	componentCache = {};
	_config = {
		cssNamespace: 'dmi',

		dependencies: {
			"react":       JsxReactUtils.AUTO_RESOLVE,
			"bluebird":    JsxReactUtils.AUTO_RESOLVE,
			"jquery":      JsxReactUtils.AUTO_RESOLVE,
			"querystring": JsxReactUtils.AUTO_RESOLVE,
			"file-saver":  JsxReactUtils.AUTO_RESOLVE,
		},
		components: {},

		log: {
			dependencyWarnings: true,
			vanillaPromiseUsageWarnings: true,
		},
	};

	moduleResolvers = {
		"react":       () => global.React,
		"bluebird":    () => global.Bluebird || global.Promise,
		"jquery":      () => global.jQuery || global.$,
	};

	/**
	 * Merges passed config with stored one
	 * @param {Object} config
	 */
	addConfig(config = {}) {
		this._config = {
			...this._config,
			...config,

			dependencies: {
				...this._config.dependencies,
				...(config.dependencies || {})
			},

			components: {
				...this._config.components,
				...(config.components || {})
			},

			log: {
				...this._config.log,
				...(config.log || {})
			}
		};
	}

	/**
	 * Requires modules
	 * @param {Function[]|Function} modules
	 */
	require(modules) {
		if(modules instanceof Array == false) {
			modules = [modules];
		}

		for(const module of modules) {
			module();
		}
	}

	dependency(module) {
		let result = this.config(`dependencies.${module}`);

		if(result === JsxReactUtils.AUTO_RESOLVE) {
			const resolver = this.moduleResolvers[module] || (() => null);

			result = resolver() || null;

			if(!result) {
				if(this.config('log.dependencyWarnings')) {
					console.warn('JsxReactUtils was unable to resolve dependency "' + module + '". You can disable auto-resolve by explicitly providing `null` in dependency config.');
				}
			}
		}

		return result;
	}

	component(component, defaultImplementation) {
		if(component in this.componentCache == false) {
			this.componentCache[component] = this.config(`components.${component}`, x => x)(defaultImplementation());
		}

		return this.componentCache[component];
	}

	config(path = '', defaultValue = null) {
		path = path.split('.').filter(x => x);

		let value = this._config;

		while(path.length) {
			const key = path.shift();

			if(!value || key in value == false) {
				return defaultValue;
			}

			value = value[key];
		}

		if(typeof(value) === "undefined") {
			return defaultValue;
		}

		return value;
	}

	init() {}
}