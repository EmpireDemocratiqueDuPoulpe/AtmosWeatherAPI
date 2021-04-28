import mongoose from "mongoose";

/*****************************************************
 * Mongoose schemes
 *****************************************************/

const CitySchema = new mongoose.Schema({
	uid: { type: String },
	name: { type: String }
});

const Cities = mongoose.model("City", CitySchema, "cities");

/*****************************************************
 * CRUD Methods
 *****************************************************/

/* ---- CREATE ---------------------------------- */
const add = (uid, name) => {
	const city = new Cities({
		uid: uid,
		name: name
	});

	return city.save();
};

/* ---- READ ------------------------------------ */
const getOf = uid => {
	return Cities.find({ uid: uid }).exec();
};

const getAll = () => {
	return Cities.find({}).exec();
};

/* ---- DELETE ---------------------------------- */
const del = (uid, name) => {
	return Cities.deleteOne({ uid: uid, name: name }).exec();
};

/*****************************************************
 * Export
 *****************************************************/

const CityModel = { add, getOf, getAll, delete: del };
export default CityModel;