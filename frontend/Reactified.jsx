import reactified_Promise from "./Reactified/ReactifiedPromise";
import reactified_Array   from "./Reactified/ReactifiedArray";
import reactified_Hooks   from "./Reactified/ReactifiedHooks";
import reactified_Object  from "./Reactified/ReactifiedObject";

/**
 * @callback ReactifiedConfigComponentGenerator
 * @param {typeof React.Component} defaultImplementation
 * @returns {typeof React.Component}
 *
 * A function receives a default implementation and is expected to return React component class or function
 */

/**
 * @typedef ReactifiedConfig
 * @property {ReactifiedConfigComponentGenerator} ErrorSign ErrorSign component generator
 * @property {ReactifiedConfigComponentGenerator} Loading Loading component generator
 * @property {ReactifiedConfigComponentGenerator} PromiseRenderer PromiseRenderer component generator
 * @property {ReactifiedConfigComponentGenerator} Link Link component generator
 * @property {ReactifiedConfigComponentGenerator} ArrayRenderer ArrayRenderer component generator
 */

export default () => {
	/**
	 * Global jsx-react-utils/reactified configuration object
	 * @type {ReactifiedConfig}
	 */
	global.Reactified = global.Reactified || {};

	reactified_Promise();
	reactified_Array();
	reactified_Hooks();
	reactified_Object();
}