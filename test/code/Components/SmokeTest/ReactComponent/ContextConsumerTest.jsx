import SmokeTest from "../SmokeTest";
import TestContext from "./ContextConsumerTest/TestContext";
import ContextConsumerTestChildren from "./ContextConsumerTest/ContextConsumerTestChildren";

export default class ContextConsumerTest extends SmokeTest {
	@state contextValue = 'default';

	@ref consumer;

	renderCount = 0;

	async isPassed() {
		if(this.rootRef.querySelector('b').innerHTML != 'default') {
			return false;
		}

		if(this.renderCount != 1 || this.consumer.renderCount != 1) {
			console.warn('Wrong render count', this.renderCount, this.consumer.renderCount);
			return false;
		}

		this.rootRef.querySelector('button').click();

		await delay(100);

		if(this.rootRef.querySelector('b').innerHTML != 'changed') {
			return false;
		}

		if(this.renderCount != 2 || this.consumer.renderCount != 2) {
			console.warn('Wrong render count', this.renderCount, this.consumer.renderCount);
			return false;
		}

		return true;
	}

	get useInternalRef() {
		return true;
	}

	renderTest() {
		this.renderCount++;

		return (
			<div>
				<TestContext.Container target={this}>
					<div>
						<ContextConsumerTestChildren ref={this.ref.consumer} />
					</div>
				</TestContext.Container>
			</div>
		);
	}
}