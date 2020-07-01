import SmokeTest from "../SmokeTest";

export default class ReactifiedPromiseTest extends SmokeTest {
	async asyncContent() {
		await delay(800);
		return "Reactified promise works";
	}

	async isPassed() {
		await delay(900);

		return this.testContentEl.innerHTML == 'Reactified promise works';
	}

	renderTest() {
		return this.asyncContent();
	}
}