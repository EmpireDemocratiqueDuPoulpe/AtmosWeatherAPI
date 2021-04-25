import { Router } from "express";
import checkParams from "../../global/checkParams.js";
import CityModel from "../models/CityModel.js";

const route = Router();

export default (router) => {
	router.use("/cities", route);

	/* ---- CREATE ---------------------------------- */
	route.post("/", (request, response) => {
		const params = checkParams(request, ["uid", "name"]);

		if (params.missingMsg) {
			return response.json({ code: 400, error: params.missingMsg }).status(400).end();
		}

		CityModel.add(params.uid, params.name)
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

	route.get("/:uid", (request, response) => {
		const params = checkParams(request, ["uid"]);

		if (params.missingMsg) {
			return response.json({ code: 400, error: params.missingMsg }).status(400).end();
		}

		CityModel.getOf(params.uid)
			.then(cities => response.json(cities).status(200).end())
			.catch(err => response.json({code: 500, error: err.message}).status(500).end());
	});
};