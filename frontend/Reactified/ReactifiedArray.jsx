import JsxReactUtils from "../../base/JsxReactUtils";
import ArrayRendererFn from "./../Components/Reactified/ArrayRenderer";

export default () => {
	const React = JsxReactUtils.dependency("react");

	Object.defineProperty(Array.prototype, 'toReact', {
		enumerable: false,
		value(limit = 2) {
			const ArrayRenderer = JsxReactUtils.component('ArrayRenderer', ArrayRendererFn);

			return <ArrayRenderer array={this} allowExpand expandToList limit={limit} />;
		}
	});
}