import mongoose from "mongoose";

/*****************************************************
 * Mongoose schemes
 *****************************************************/

const TokenSchema = new mongoose.Schema({
	user_id: { type: String },
	token: { type: String }
});

const Tokens = mongoose.model("Token", TokenSchema, "tokens");

/*****************************************************
 * CRUD Methods
 *****************************************************/

/* ---- CREATE ---------------------------------- */
// TODO: Better token generation
const getNew = userId => {
	const randomToken = "superSafeToken";

	// Add the token
	const token = new Tokens({
		user_id: userId,
		token: randomToken,
	});

	return token.save();
};

/*****************************************************
 * Export
 *****************************************************/

const TokenModel = { getNew };
export default TokenModel;