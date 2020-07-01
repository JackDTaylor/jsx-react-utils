export default () => {
	const idPropertyNameFromFullRules = [
		{regex: /ss$/,   suffix: 'ss_id'},
		{regex: /sses$/, suffix: 'ss_ids'},
		{regex: /ies$/,  suffix: 'y_ids'},
		{regex: /s$/,    suffix: '_ids'},
	];
	const fullPropertyNameFromIdRules = [
		{regex: /ss_id$/,  suffix: 'ss'},
		{regex: /ss_ids$/, suffix: 'sses'},
		{regex: /y_ids$/,  suffix: 'ies'},
		{regex: /_ids$/,   suffix: 's'},
		{regex: /_id$/,    suffix: ''},
	];

	/**
	 * Converts strings to ID variant:
	 *   user => user_id
	 *   objects => object_ids
	 *   properties => property_ids
	 *
	 * @param propertyName {string}
	 * @returns {string}
	 */
	global.idPropertyNameFromFull = function idPropertyNameFromFull(propertyName) {
		for(const rule of idPropertyNameFromFullRules) {
			if(rule.regex.test(propertyName)) {
				return propertyName.replace(rule.regex, rule.suffix);
			}
		}

		return `${propertyName}_id`;
	};

	/**
	 * Converts strings from ID to full variant:
	 *   user_id => user
	 *   object_ids => objects
	 *   property_ids => properties
	 *
	 * @param propertyName {string}
	 * @returns {string}
	 */
	global.fullPropertyNameFromId = function fullPropertyNameFromId(propertyName) {
		for(const rule of fullPropertyNameFromIdRules) {
			if(rule.regex.test(propertyName)) {
				return propertyName.replace(rule.regex, rule.suffix);
			}
		}

		return propertyName;
	};
}