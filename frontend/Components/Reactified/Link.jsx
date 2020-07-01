import JsxReactUtils from "../../../base/JsxReactUtils";
import ReactComponentFn from "../ReactComponent/ReactComponent";

export default () => {
	const React = JsxReactUtils.dependency("react");
	const ReactComponent = JsxReactUtils.component("ReactComponent", ReactComponentFn);

	return class Link extends ReactComponent {
		@prop target;
		@prop dotted = false;

		get additionalClasses() {
			return [{dotted: this.dotted}];
		}

		get targetProps() {
			if(valueType(this.target) == Function) {
				return {onClick: this.target};
			}

			return {href: this.target};
		}

		get restProps() {
			const {target,dotted,...restProps} = this.props;
			return restProps;
		}

		render() {
			return <a {...this.cls} {...this.targetProps} {...this.restProps} />
		}
	}
}