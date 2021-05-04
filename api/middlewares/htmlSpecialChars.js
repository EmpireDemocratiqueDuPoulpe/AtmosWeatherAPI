const escapedChars = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" };
const escapedFields = [ "password", "password1", "password2" ];

export default function htmlSpecialChars(request, response, next) {
	const isGET = request.method.toUpperCase() === "GET";
	const params = isGET ? request.params : request.body;

	for (const key in params) {
		if (Object.prototype.hasOwnProperty.call(params, key)) {
			if (!isString(params[key]) || isFieldEscaped(key)) continue;

			params[key] = escapeHTML(params[key]);
		}
	}

	if (isGET) {
		request.params = params;
	} else {
		request.body = params;
	}

	return next();
}

function isString(value) {
	return Object.prototype.toString.call(value) === "[object String]";
}

function isFieldEscaped(fieldName) {
	return escapedFields.includes(fieldName.toLowerCase());
}

function escapeHTML(string) {
	return string.replace(/[&<>"']/g, char => { return escapedChars[char]; });
}