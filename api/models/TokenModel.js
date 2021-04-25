import mongoose from "mongoose";
import { promisify } from "util";
import crypto from "crypto";
import base64url from "base64url";

const randomBytesAsync = promisify(crypto.randomBytes);

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
// TODO: Add token expiration date
const getNew = async userId => {
	const buf = await randomBytesAsync(48);
	const randomToken = base64url(buf.toString("base64"));
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