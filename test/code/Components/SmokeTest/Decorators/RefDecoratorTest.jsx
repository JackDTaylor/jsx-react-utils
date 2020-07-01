import SmokeTest from "../SmokeTest";

export default class RefDecoratorTest extends SmokeTest {
	@ref testRef;

	async isPassed() {
		return this.testRef && this.testRef.innerHTML === 'Ref decorator works';
	}

	renderTest() {
		return (
			<div ref={this.ref.testRef}>Ref decorator works</div>
		);
	}
}