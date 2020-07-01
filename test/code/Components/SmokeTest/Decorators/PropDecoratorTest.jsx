import SmokeTest from "../SmokeTest";

export default class PropDecoratorTest extends SmokeTest {	@prop prop;
	@prop otherProp = 'Default prop value works';

	@state passed = true;

	renderTest() {
		return (
			<___>
				<div>{this.prop}</div>
				<div>{this.otherProp}</div>
			</___>
		);
	}
}