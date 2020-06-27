import JsxReactUtils from "../../base/JsxReactUtils";
import ArrayRendererFn from "./Components/ArrayRenderer";

export default () => {
	const React = JsxReactUtils.dependency("react");
	const ArrayRenderer = JsxReactUtils.component('ArrayRenderer', ArrayRendererFn);

	Object.defineProperty(Array.prototype, 'toReact', {
		enumerable: false,
		value(limit = 2) {
			return <ArrayRenderer array={this} allowExpand expandToList limit={limit} />;
		}
	});
}