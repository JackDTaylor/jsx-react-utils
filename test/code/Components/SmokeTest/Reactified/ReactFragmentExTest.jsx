import SmokeTest from "../SmokeTest";

export default class ReactFragmentExTest extends SmokeTest {
	async isPassed() {
		return this.testContentEl.innerHTML == 'Render as React works<br>Render as String works';
	}

	renderTest() {
		return (
			<___>
				<___ alt="some alt">Render as React works</___>
				<br />
				{`${<___ alt="Render as String works">some sontent</___>}`}
			</___>
		);
	}
}