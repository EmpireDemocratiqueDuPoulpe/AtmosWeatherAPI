import { Router } from "express";
import UserModel from "../models/UserModel.js";

const route = Router();

// TODO: Optimize. One day. Maybe. Not sure. uugh
export default (router) => {
	router.use("/users", route);

	/* ---- ADD ------------------------------------- */
	route.post("/", async (request, response) => {
		const { username, email, password1, password2 } = request.body;

		try {
			const result = await UserModel.add(username, email, password1, password2);

			if (result.error) {
				response.json(result).status(result.code).end();
			} else {
				response.status(202).end();
			}

		} catch (err) {
			response.json({error: err.message}).status(500).end();
		}
	});

	/* ---- GET ------------------------------------- */
	route.get("/all", (request, response) => {
		UserModel.getAll()
			.then(users => response.json(users).status(200).end())
			.catch(err => response.json({error: err.message}).status(500).end());
	});

	route.get("/:id", (request, response) => {
		const { id } = request.params;

		if (!id) {
			response.send("Missing \"id\" in query params.").status(400).end();
		} else {
			UserModel.get(id)
				.then(user => response.json(user || {}).status(200))
				.catch(err => response.json({error: err.message}).status(500))
				.finally(() => response.end());
		}
	});
};