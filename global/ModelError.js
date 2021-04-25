export default class ModelError {
	constructor(code = null, message = null) {
		this._code = code;
		this._message = message;
	}

	code() {
		return this._code || 500;
	}

	message() {
		return this._message || "Unknown error";
	}

	json() {
		return { code: this.code(), message: this.message() };
	}
}