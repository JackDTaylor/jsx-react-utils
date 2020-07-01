import JsxReactUtils from "../../../base/JsxReactUtils";

export default () => {
	const React = JsxReactUtils.dependency("react");

	class ErrorBoundary extends React.Component {
		@state hasError = false;
		@state error = null;

		componentDidCatch(error, info) {
			if(JsxReactUtils.config('log.errorBoundary.logOnError')) {
				console.error(info);
			}

			this.error = error;
		}

		static getDerivedStateFromError(error) {
			return { hasError: true, error };
		}

		render() {
			if(this.error) {
				return <b title={this.error}>[Ошибка]</b>;
			}

			return this.props.children;
		}
	}
	global.ErrorBoundary = ErrorBoundary;

	return ErrorBoundary;
}