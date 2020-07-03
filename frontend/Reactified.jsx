import JsxReactUtils from "../base/JsxReactUtils";
import reactified_Promise from "./Reactified/ReactifiedPromise";
import reactified_Array   from "./Reactified/ReactifiedArray";
import reactified_Hooks   from "./Reactified/ReactifiedHooks";
import reactified_Object  from "./Reactified/ReactifiedObject";

export default () => {
	if(!React) {
		if(JsxReactUtils.config('log.dependencyWarnings')) {
			console.warn('JsxReactUtils.Reactified requires "react" dependency.');
		}

		return;
	}

	reactified_Promise();
	reactified_Array();
	reactified_Hooks();
	reactified_Object();
}