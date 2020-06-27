export default class JsxReactUtils {
	static instance;

	static get Instance() {
		if(!this.instance) {
			this.instance = new this;
		}

		return this.instance;
	}

	static addConfig(...args) {
		return this.Instance.addConfig(...args);
	}

	static require(...args) {
		return this.Instance.require(...args);
	}

	static dependency(...args) {
		return this.Instance.dependency(...args);
	}

	static component(...args) {
		return this.Instance.component(...args);
	}

	static config(...args) {
		return this.Instance.config(...args);
	}

	componentCache = {};
	_config = {
		cssNamespace: 'dmi',

		dependencies: {},
		components: {},
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
		return this.config(`dependencies.${module}`);
	}

	component(component, defaultImplementation) {
		if(component in this.componentCache == false) {
			this.componentCache[component] = this.config(`component.${module}`, x => x)(defaultImplementation());
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
}