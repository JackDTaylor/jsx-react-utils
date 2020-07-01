import BoundDecoratorTestParent from "./BoundDecoratorTest/BoundDecoratorTestParent";

export default class BoundDecoratorTest extends BoundDecoratorTestParent {
	@bound boundMethod() {
		if(this instanceof BoundDecoratorTest == false) {
			this.failed = true;
			this.result = ['Child not bound'];
			return;
		}

		if(this.result.length > 5) {
			this.failed = true;
			this.result = ['Failed with endless loop'];
			return;
		}

		this.result = [...this.result, 'Child method works'];

		return super.boundMethod();
	}

	async isPassed() {
		this.boundMethod();

		return this.result.join('<!>') == 'Child method works<!>Parent method works'
	}

	renderTest() {
		return (
			<___>
				{this.result.map(x => <div key={x}>{x}</div>)}
			</___>
		);
	}
}