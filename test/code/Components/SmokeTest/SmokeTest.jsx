export default class SmokeTest extends ReactComponent {
	get additionalClasses() {
		return [...super.additionalClasses, {passed: this.passed}, {failed: this.failed}];
	}

	async componentDidMount() {
		try {
			const result = await this.isPassed();

			if(isUndefined(result)) {
				return;
			}

			this.passed = !!result;
			this.failed =  !result;
		} catch(e) {
			console.error(e);

			this.failed = true;
			this.passed = false;
		}
	}

	@state passed = false;
	@state failed = false;

	@ref testContentEl;

	async isPassed() {}

	renderTest() {
		if(!this.failed) {
			this.failed = true;
		}

		return `${this.constructor.name}::renderTest()`;
	}

	render() {
		// if(this.passed) {
		// 	return '';
		// }

		return (
			<div {...this.cls}>
				<div className="test-name">{this.constructor.name}</div>
				<div className="test-status">{this.passed ? 'Passed' : this.failed ? 'Failed' : 'Pending'}</div>

				<div className="test-content" ref={this.ref.testContentEl}>
					{this.renderTest()}
				</div>
			</div>
		);
	}
}