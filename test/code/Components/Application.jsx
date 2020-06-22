export default class Application extends ReactComponent {
	@prop prop;
	@prop otherProp = 'Default prop value';

	@state counter = 0;

	async asyncContent() {
		await delay(1000);

		return "Async content";
	}

	@bound incrementCounter() {
		this.counter++;
	}

	@bound decrementCounter() {
		this.counter--;
	}

	render() {
		return (
			<div {...this.cls}>
				<div>{this.prop}</div>
				<div>{this.otherProp}</div>
				<div>
					<button onClick={this.decrementCounter}>-</button>
					<b>{this.counter}</b>
					<button onClick={this.incrementCounter}>+</button>
				</div>

				<div>{this.asyncContent()}</div>
			</div>
		);
	}
}