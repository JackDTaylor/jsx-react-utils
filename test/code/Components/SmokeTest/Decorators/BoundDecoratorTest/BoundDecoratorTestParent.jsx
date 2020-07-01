import SmokeTest from "../../SmokeTest";

export default class BoundDecoratorTestParent extends SmokeTest {
	@state result = [];

	@bound boundMethod() {
		if(this instanceof BoundDecoratorTestParent == false) {
			this.failed = true;
			this.result = ['Parent not bound'];
			return;
		}

		this.result = [...this.result, 'Parent method works'];
	}
}