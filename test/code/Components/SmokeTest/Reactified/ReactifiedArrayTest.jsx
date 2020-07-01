import SmokeTest from "../SmokeTest";
import JsxReactUtils from "../../../../../base/JsxReactUtils";

export default class ReactifiedArrayTest extends SmokeTest {
	async isPassed() {
		const cn = JsxReactUtils.config('cssNamespace');
		const expectedBase = `1, 2 и <a class="${cn} ${cn}-link js--dotted">еще 3</a>`;
		const expectedExpanded = [1,2,3,4,5].map(x => `<div class="${cn} ${cn}-array-item">${x}</div>`).join('');

		if(this.testContentEl.innerHTML != expectedBase) {
			return false;
		}

		this.testContentEl.children[0].click();

		await delay(100);

		return this.testContentEl.innerHTML == expectedExpanded;
	}

	renderTest() {
		return [
			1,
			2,
			3,
			4,
			5,
		].toReact();
	}
}