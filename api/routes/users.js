import { Router } from "express";
import checkParams from "../../global/checkParams.js";
import UserModel from "../models/UserModel.js";
import TokenModel from "../models/TokenModel.js";
import ModelError from "../../global/ModelError.js";

const route = Router();

// TODO: Optimize. One day. Maybe. Not sure. uugh
export default (router) => {
	router.use("/users", route);

	/* ---- CREATE ---------------------------------- */
	route.post("/", async (request, response) => {
		const params = checkParams(request, ["username", "email", "password1", "password2"]);

		if (params.missingMsg) {
			return response.json({ error: params.missingMsg }).status(400).end();
		}

		try {
			const result = await UserModel.add(params.username, params.email, params.password1, params.password2);

			if (result instanceof ModelError) {
				response.json(result.json()).status(result.code()).end();
			} else {
				response.status(202).end();
			}

		} catch (err) {
			response.json({code: 500, error: err.message}).status(500).end();
		}
	});

	/* ---- READ ------------------------------------ */
	route.post("/login", async (request, response) => {
		const params = checkParams(request, ["email", "password"]);

		if (params.missingMsg) {
			return response.json({ error: params.missingMsg }).status(400).end();
		}

		try {
			const result = await UserModel.login(params.email, params.password);

			if (result instanceof ModelError) {
				response.json(result.json()).status(result.code()).end();
			} else {
				const token = await TokenModel.getNew(result._id);
				response.json({ token: token.token }).status(200).end();
			}

		} catch (err) {
			response.json({code: 500, error: err.message}).status(500).end();
		}
	});

	route.get("/all", (request, response) => {
		UserModel.getAll()
			.then(users => response.json(users).status(200).end())
			.catch(err => response.json({code: 500, error: err.message}).status(500).end());
	});

	route.get("/:id", (request, response) => {
		const params = checkParams(request, ["id"]);

		if (params.missingMsg) {
			return response.json({ error: params.missingMsg }).status(400).end();
		}

		UserModel.get(params.id)
			.then(user => response.json(user || {}).status(200))
			.catch(err => response.json({code: 500, error: err.message}).status(500))
			.finally(() => response.end());
	});
};