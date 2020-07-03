import JsxReactUtils from "./base/JsxReactUtils";

import common from "./common";
import frontend from "./frontend"

export default function importJsxReactUtils(modules = null, config = {}) {
	const availableModules = {common, frontend};

	if(arguments.length < 2 && modules instanceof Array == false) {
		config = modules || {};
		modules = Object.keys(availableModules);
	}

	for(const module of modules) {
		if(module in availableModules) {
			availableModules[module](config);
		}
	}

	return JsxReactUtils.init();
}