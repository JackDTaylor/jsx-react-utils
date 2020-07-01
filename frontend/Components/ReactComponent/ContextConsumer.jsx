import JsxReactUtils from "../../../base/JsxReactUtils";
import ErrorBoundaryFn from "./ErrorBoundary";
import ReactComponentFn from "./ReactComponent";

export default () => {
	const React = JsxReactUtils.dependency("react");
	const ReactComponent = JsxReactUtils.component("ReactComponent", ReactComponentFn);

	class ContextConsumer extends ReactComponent {
		static CssClasses = [];
		static IsContexted = true;

		/**
		 * @param result Rendered contexted component
		 * @param context Attached context
		 * @param data An object with `props` and `children` keys
		 *
		 * @return {*}
		 */
		static ContextualRender(result, context, data) {
			const ErrorBoundary = JsxReactUtils.component('ErrorBoundary', ErrorBoundaryFn);
			return <ErrorBoundary>{result}</ErrorBoundary>;
		}

		@prop consumedContext;
		@prop isContexted;

		get actualProps() {
			const {consumedContext, isContexted, contextualRef, nonContextable, ...restProps} = this.props;
			return restProps;
		}
	}
	global.ContextConsumer = ContextConsumer;

	return ContextConsumer;
}