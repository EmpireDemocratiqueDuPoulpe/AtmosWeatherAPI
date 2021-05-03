import { Router } from "express";
import middlewares from "../middlewares/index.js";
import CityModel from "../models/CityModel.js";
import ModelError from "../../global/ModelError.js";

const route = Router();

export default (router) => {
	router.use("/cities", route);

	/* ---- CREATE ---------------------------------- */
	route.post("/", middlewares.checkParams("uid", "name"), async (request, response) => {
		const { uid, name } = request.body;

		if(await CityModel.checkIfExist(uid, name)) {
			return response.status(400).json(new ModelError(400, "The city is already added").json()).end();
		}

		CityModel.add(uid, name)
			.then(() => response.status(200).json({ code: 200 }).end())
			.catch(err => response.json(new ModelError(500, err.message).json()).status(500).end());
	});

	/* ---- READ ------------------------------------ */
	// TODO: Remove dev route
	route.get("/dev/all", (request, response) => {
		CityModel.getAll()
			.then(cities => response.status(200).json(cities).end())
			.catch(err => response.status(500).json(new ModelError(500, err.message).json()).end());
	});

	route.get("/:uid", middlewares.checkParams("uid"), (request, response) => {
		const { uid } = request.params;

		CityModel.getOf(uid)
			.then(cities => response.status(200).json(cities).end())
			.catch(err => response.status(500).json(new ModelError(500, err.message).json()).end());
	});

	/* ---- DELETE ---------------------------------- */
	route.delete("/", middlewares.checkParams("uid", "name"), (request, response) => {
		const { uid, name } = request.body;

		CityModel.delete(uid, name)
			.then(status => {
				if (status.ok === 1) {
					response.status(202).json({ code: 202 }).end();
				} else {
					response.status(404).json(new ModelError(404, `This user (${uid}) has no city named "${name}"`).json()).end();
				}
			})
			.catch(err => response.status(500).json(new ModelError(500, err.message).json()).end());
	});
};