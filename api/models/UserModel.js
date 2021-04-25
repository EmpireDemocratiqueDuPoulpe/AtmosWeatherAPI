import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "../../config/config.js";
import ModelError from "../../global/ModelError.js";

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

const isValidUsername = username => {
	return username !== undefined && `${username}`.length > 0 && `${username}`.length < 32;
};

const isUsernameAvailable = async username => {
	return !!await Users.findOne({ username: username }).exec();
};

const isValidEmail = email => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isEmailAvailable = async email => {
	return !!await Users.findOne({ email: email }).exec();
};

const isValidPassword = password => {
	return password !== undefined && `${password}`.length >= 8;
};

const doesPasswordsMatch = (password1, password2) => {
	return password1 === password2;
};

const hashPassword = async password => {
	return await bcrypt.hash(password, config.app.security.saltRound);
};

const doesPasswordMatchHash = async (password, hash) => {
	return await bcrypt.compare(password, hash);
};

/*****************************************************
 * CRUD Methods
 *****************************************************/

/* ---- CREATE ---------------------------------- */
const add = async (username, email, password1, password2) => {
	// Check if something is invalid
	if (!isValidUsername(username)) {
		return new ModelError(400, "The username cannot be empty or longer than 32 characters.");
	}

	if (!isValidEmail(email)) {
		return new ModelError(400, "You must provide a valid email address.");
	}

	if (!isValidPassword(password1) || !isValidPassword(password2)) {
		return new ModelError(400, "The password must be at least 8 characters long.");
	}

	if (!doesPasswordsMatch(password1, password2)) {
		return new ModelError(400, "The passwords don't match.");
	}

	// Check if something is not available
	if (await isUsernameAvailable(username)) {
		return new ModelError(400, "This username is already taken.");
	}

	if (await isEmailAvailable(email)) {
		return new ModelError(400, "This email address is already taken.");
	}

	// Hash password
	const hashedPwd = await hashPassword(password1);

	// Add the user
	const user = new Users({
		username: username,
		email: email,
		password: hashedPwd
	});

	return user.save();
};

/* ---- READ ------------------------------------ */
const get = uid => {
	return Users.findById(uid).exec();
};

const getByEmail = email => {
	return Users.findOne({ email: email }).exec();
};

const getAll = () => {
	return Users.find({}).exec();
};

const login = async (email, password) => {
	if (!isValidEmail(email)) {
		return new ModelError(400, "You must provide a valid email address.");
	}

	if (!isValidPassword(password)) {
		return new ModelError(400, "The password must be at least 8 characters long.");
	}

	const user = await getByEmail(email);
	const canConnect = user ? await doesPasswordMatchHash(password, user.password) : false;

	if (!canConnect) {
		return new ModelError(400, "No users were found with this email and password combination.");
	} else {
		return user;
	}
};

/*****************************************************
 * Export
 *****************************************************/

const UserModel = { add, get, getByEmail, getAll, login };
export default UserModel;