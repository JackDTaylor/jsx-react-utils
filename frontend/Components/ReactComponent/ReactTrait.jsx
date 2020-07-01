import JsxReactUtils from "../../../base/JsxReactUtils";
import reactUseNewLifecycle from "../../Helpers/reactUseNewLifecycle";

export default () => {
	const React = JsxReactUtils.dependency("react");

	class ReactTrait {
		constructor(container, settings = {}) {
			this.container = container;
			this.settings = settings;
		}

		get rootRef() {
			return this.container && this.container.rootRef;
		}

		componentWillInit() {}
		componentDidMount() {}
		componentWillUnmount() {}

		get rootProps() {
			return {};
		}
	}
	global.ReactTrait = ReactTrait;

	if(reactUseNewLifecycle(React) == false) {
		ReactTrait.prototype.componentWillMount = function componentWillMount() {}
	}

	return ReactTrait;
}