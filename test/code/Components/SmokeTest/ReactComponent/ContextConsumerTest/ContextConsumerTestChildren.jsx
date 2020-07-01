import TestContext from "./TestContext";

/**
 * @extends TestContextConsumer
 */
export default class ContextConsumerTestChildren extends TestContext.ReactComponent {
	renderCount = 0;

	@bound changeContextValue() {
		this.contextContainer.contextValue = 'changed';
	}

	render() {
		this.renderCount++;

		return (
			<div {...this.cls}>
				<div>Context value: <b>{this.contextContainer.contextValue}</b></div>
				<button onClick={this.changeContextValue}>Change context value</button>
			</div>
		)
	}
}