import { Router } from "express";
import middlewares from "../middlewares/index.js";
import CityModel from "../models/CityModel.js";

const route = Router();

export default (router) => {
	router.use("/cities", route);

	/* ---- CREATE ---------------------------------- */
	route.post("/", middlewares.checkParams("uid", "name"), (request, response) => {
		const { uid, name } = request.body;

		CityModel.add(uid, name)
			.then(() => response.json({ message: "City added" }).status(200).end())
			.catch(err => response.json({code: 500, error: err.message}).status(500).end());
	});

	/* ---- READ ------------------------------------ */
	// TODO: Remove dev route
	route.get("/dev/all", (request, response) => {
		CityModel.getAll()
			.then(cities => response.json(cities).status(200).end())
			.catch(err => response.json({code: 500, error: err.message}).status(500).end());
	});

	route.get("/:uid", middlewares.checkParams("uid"), (request, response) => {
		const { uid } = request.params;

		CityModel.getOf(uid)
			.then(cities => response.json(cities).status(200).end())
			.catch(err => response.json({code: 500, error: err.message}).status(500).end());
	});
};