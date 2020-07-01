import ErrorBoundaryFn from "./Components/ReactComponent/ErrorBoundary";
import ReactTraitFn from "./Components/ReactComponent/ReactTrait";
import ReactComponentFn from "./Components/ReactComponent/ReactComponent";
import ContextConsumerFn from "./Components/ReactComponent/ContextConsumer";

export default () => {
	/**
	 * Attaches trait to ReactComponent-based component
	 *
	 * @decorator
	 * @param Trait {Function} Trait class
	 * @param settings {Object} Settings to pass into trait's constructor
	 *
	 * @return {Function}
	 */
	global.useTrait = function useTrait(Trait, settings = {}) {
		return function(Class) {
			if(!Class.Traits) {
				Object.defineProperty(Class, 'Traits', {value: []});
			}

			Class.Traits.push({Trait, settings});

			return Class;
		}
	};

	ReactTraitFn();
	ErrorBoundaryFn();
	ReactComponentFn();
	ContextConsumerFn();
}