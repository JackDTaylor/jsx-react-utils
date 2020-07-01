export default class TestGroup extends ReactComponent {
	@prop children;
	@prop name;
	@prop collapsed = false;

	render() {
		return (
			<div {...this.cls}>
				{this.collapsed == false && (
					<div className="content">{this.children}</div>
				)}
				{/* Name is last to be hidden via CSS when .content is empty */}
				<div className="name">{this.name}</div>
			</div>
		);
	}
}