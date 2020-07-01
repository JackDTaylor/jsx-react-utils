import JsxReactUtils from "./base/JsxReactUtils";

import common from "./common";
import frontend from "./frontend"

export default function importJsxReactUtils(modules = ['common', 'frontend'], config = {}) {
	const availableModules = {common, frontend};

	for(const module of modules) {
		if(module in availableModules) {
			availableModules[module](config);
		}
	}



	return JsxReactUtils.init();
}