import JsxReactUtils from "../../../base/JsxReactUtils";
import LoadingFn from "./Loading";
import ErrorSignFn from "./ErrorSign";

let idCounter = 1;
let VOID = { $symbol:'VOID' };

export default () => {
	const React = JsxReactUtils.dependency("react");

	return class PromiseRenderer extends React.PureComponent {
		@prop promise;

		@state result = VOID;
		@state error;

		state = {};

		isCancelled = false;

		constructor() {
			super(...arguments);

			this.id = idCounter++;
		}

		async componentDidMount() {
			try {
				let result = await this.promise;

				if(this.isCancelled == false) {
					this.result = result;
				}
			} catch(error) {
				this.error = error;
			}

			this.commitState();
		}

		componentWillUnmount() {
			this.isCancelled = true;
		}

		render() {
			const Loading = JsxReactUtils.component('Loading', LoadingFn);
			const ErrorSign = JsxReactUtils.component('ErrorSign', ErrorSignFn);

			if(this.error) {
				return <ErrorSign error={this.error} />;
			}

			if(this.result === VOID) {
				return <Loading />;
			}

			return empty(this.result) ? '' : this.result;
		}
	}
}