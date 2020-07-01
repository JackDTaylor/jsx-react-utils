import JsxReactUtils from "../../base/JsxReactUtils";
import "./jsx-react-utils";

import ReactDOM from "react-dom";

import Application from "./Components/Application";
import Loading from "./Components/Common/Loading";

document.addEventListener('DOMContentLoaded', async() => {
	JsxReactUtils.registerComponent('Loading', () => Loading);

	ReactDOM.render(<Application prop="Prop value" />, document.getElementById('application'));
});