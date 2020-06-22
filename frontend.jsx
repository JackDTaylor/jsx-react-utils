import frontend_Constants      from "./frontend/Constants";
import frontend_Classnames     from "./frontend/Classnames";
import frontend_Decorators     from "./frontend/Decorators";
import frontend_ReactComponent from "./frontend/ReactComponent";
import frontend_Reactified     from "./frontend/Reactified";
import frontend_URL            from "./frontend/URL";
import frontend_Envoy          from "./frontend/Envoy";

export default (dependencies = {}) => {
	global.JsxUtilsDependencies = {
		...global.JsxUtilsDependencies,
		...dependencies,
	};

	frontend_Constants();
	frontend_Classnames();
	frontend_Decorators();
	frontend_ReactComponent();
	frontend_Reactified();
	frontend_URL();
	frontend_Envoy();
};