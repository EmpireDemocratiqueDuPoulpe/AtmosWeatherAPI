import mongoose from "mongoose";

/*****************************************************
 * Mongoose schemes
 *****************************************************/

const UserSchema = new mongoose.Schema({
	username: { type: String },
	email: { type: String },
	password: { type: String }
});

const Users = mongoose.model("User", UserSchema, "users");

/*****************************************************
 * Checkers
 *****************************************************/

const checkUsername = username => {
	return username !== undefined && `${username}`.length > 0 && `${username}`.length < 32;
};

const checkUsernameAvailability = async username => {
	return !!await Users.findOne({ username: username }).exec();
};

const checkEmail = email => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const checkEmailAvailability = async email => {
	return !!await Users.findOne({ email: email }).exec();
};

const checkPassword = password => {
	return password !== undefined && `${password}`.length > 0;
};

/*
const checkPasswordsPair = (password1, password2) => {
	return password1 === password2;
};*/

/*****************************************************
 * CRUD Methods
 *****************************************************/

/* ---- CREATE ---------------------------------- */
// TODO: Checks as middlewares?
const add = (username, email, password) => {
	// Check if something is missing
	let missing = [];

	if (!checkUsername(username)) { missing.push("username"); }
	if (!checkEmail(email)) { missing.push("email"); }
	if (!checkPassword(password)) { missing.push("password"); }

	if (missing.length > 0) {
		return { code: 400, error: `Missing "${missing.join(", ")}" parameter(s) to add this new user.`};
	}

	// Check if something is not available
	let notAvailable = [];

	if (!checkUsernameAvailability(username)) { notAvailable.push("username"); }
	if (!checkEmailAvailability(email)) { notAvailable.push("email"); }

	if (notAvailable.length > 0) {
		return { code: 400, error: `These fields are already taken by another user: "${missing.join(", ")}"`};
	}

	// Add the user
	const user = new Users({
		username: username,
		email: email,
		password: password
	});

	return user.save();
};

/* ---- READ ------------------------------------ */
const get = userId => {
	return Users.findById(userId).exec();
};

const getAll = () => {
	return Users.find({}).exec();
};

/*****************************************************
 * Export
 *****************************************************/

const UserModel = { add, get, getAll };
export default UserModel;