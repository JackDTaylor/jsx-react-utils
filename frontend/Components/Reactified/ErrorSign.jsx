export default () => {
	return ({error, ...props}) => <div className="error" {...props}>{error.message}</div>;
}