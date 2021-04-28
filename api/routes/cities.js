import { Router } from "express";
import middlewares from "../middlewares/index.js";
import CityModel from "../models/CityModel.js";

const route = Router();

export default (router) => {
	router.use("/cities", route);

	/* ---- CREATE ---------------------------------- */
	// TODO: Prevent from adding a city already added
	route.post("/", middlewares.checkParams("uid", "name"), (request, response) => {
		const { uid, name } = request.body;

		CityModel.add(uid, name)
			.then(() => response.json({ code: 200, message: "City added" }).status(200).end())
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

	/* ---- DELETE ---------------------------------- */
	route.delete("/", middlewares.checkParams("uid", "name"), (request, response) => {
		const { uid, name } = request.body;

		CityModel.delete(uid, name)
			.then(status => {
				if (status.ok === 1) {
					response.json({ code: 202 }).status(202).end();
				} else {
					response.json({ code: 404, message: `This user (${uid}) has no city named "${name}"` }).status(404).end();
				}
			})
			.catch(err => response.json({code: 500, error: err.message}).status(500).end());
	});
};