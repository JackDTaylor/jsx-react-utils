import "./jsx-react-utils";
import ReactDOM from "react-dom";
import Application from "./Components/Application";

document.addEventListener('DOMContentLoaded', async() => {
	ReactDOM.render(<Application prop="Prop value" />, document.getElementById('application'));
});