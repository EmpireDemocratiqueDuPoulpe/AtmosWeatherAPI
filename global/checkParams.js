export default function checkParams(request, paramsNames) {
	const params = request.method.toUpperCase() === "GET" ? request.params : request.body;
	const checkedParams = { missing: [] };
	const addMissingParam = n => checkedParams.missing.push(n);

	// Search for every parameter name and value
	paramsNames.forEach((name) => {
		if (Object.prototype.hasOwnProperty.call(params, name)) {
			const param = params[name];

			if (isNullOrUndefined(param)) addMissingParam(name);
			if (isEmptyString(param)) addMissingParam(name);

			checkedParams[name] = param;
		} else {
			addMissingParam(name);
		}
	});

	// Build an error message in case of missing parameter
	if (checkedParams.missing.length > 0) {
		checkedParams.missingMsg = `Missing parameter${checkedParams.missing.length > 1 ? "s" : ""}: ${checkedParams.missing.join(", ")}`;
	}

	return checkedParams;
}

function isNullOrUndefined(value) {
	return value === undefined || value === null;
}

function isEmptyString(value) {
	return Object.prototype.toString.call(value) === "[object String]" ? value.length === 0 : false;
}