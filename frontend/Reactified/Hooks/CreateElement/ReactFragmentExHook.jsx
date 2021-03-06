import JsxReactUtils from "../../../../base/JsxReactUtils";
import AbstractCreateElementHook from "./AbstractCreateElementHook";

export default () => {
	const React = JsxReactUtils.dependency("react");

	class ReactFragmentEx extends React.PureComponent {
		static ToString(props) {
			return props.alt || '[object ReactFragmentEx]';
		}

		render() {
			return <___ children={this.props.children} />;
		}
	}

	return new class ReactFragmentExHook extends AbstractCreateElementHook {
		condition() {
			return this.element === React.Fragment && this.props && this.props.alt;
		}

		action() {
			this.element = ReactFragmentEx;
		}
	}
}