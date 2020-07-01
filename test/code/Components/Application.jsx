import TestGroup from "./SmokeTest/TestGroup";
import BoundDecoratorTest from "./SmokeTest/Decorators/BoundDecoratorTest";
import ReactifiedPromiseTest from "./SmokeTest/Reactified/ReactifiedPromiseTest";
import PropDecoratorTest from "./SmokeTest/Decorators/PropDecoratorTest";
import StateDecoratorTest from "./SmokeTest/Decorators/StateDecoratorTest";
import RefDecoratorTest from "./SmokeTest/Decorators/RefDecoratorTest";
import ReactFragmentExTest from "./SmokeTest/Reactified/ReactFragmentExTest";
import ReactifiedArrayTest from "./SmokeTest/Reactified/ReactifiedArrayTest";
import ContextConsumerTest from "./SmokeTest/ReactComponent/ContextConsumerTest";
import ReactTraitTest from "./SmokeTest/ReactComponent/ReactTraitTest";
import NounTest from "./SmokeTest/Utils/NounTest";
import DateTest from "./SmokeTest/Utils/DateTest";

export default class Application extends ReactComponent {
	render() {
		return (
			<div {...this.cls}>
				<TestGroup name="ReactComponent">
					<ContextConsumerTest />
					<ReactTraitTest />
				</TestGroup>

				<TestGroup name="Utils">
					<DateTest />
					<NounTest />
				</TestGroup>

				<TestGroup name="Reactified">
					<ReactifiedPromiseTest />
					<ReactifiedArrayTest />
					<ReactFragmentExTest />
				</TestGroup>

				<TestGroup name="Decorators" >
					<BoundDecoratorTest />
					<StateDecoratorTest />
					<PropDecoratorTest prop="Custom prop value works" />
					<RefDecoratorTest />
				</TestGroup>
			</div>
		);
	}
}