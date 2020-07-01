import SmokeTest from "../SmokeTest";

export default class StateDecoratorTest extends SmokeTest {
	@state counter = 0;

	@ref decreaseButton;
	@ref increaseButton;

	rendersCount = 0;

	changeCounter(amount) {
		this.counter += amount;
	}

	async isPassed() {
		const initialRendersCount = this.rendersCount;
		const initialCounter = this.counter;

		this.increaseButton.click();
		await delay(100);

		return (this.rendersCount - initialRendersCount == 1) && (this.counter - initialCounter == 1);
	}

	renderTest() {
		if(this.counter != 0) {
			this.passed = true;
		}

		this.rendersCount++;

		return (
			<___>
				<button onClick={() => this.changeCounter(-1)} ref={this.ref.decreaseButton}>-</button>
				<b>{this.counter}</b>
				<button onClick={() => this.changeCounter(+1)} ref={this.ref.increaseButton}>+</button>
			</___>
		);
	}
}