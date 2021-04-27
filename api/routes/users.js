import { Router } from "express";
import middlewares from "../middlewares/index.js";
import UserModel from "../models/UserModel.js";
import TokenModel from "../models/TokenModel.js";
import ModelError from "../../global/ModelError.js";

const route = Router();

// TODO: Optimize. One day. Maybe. Not sure. uugh
export default (router) => {
	router.use("/users", route);

	/* ---- CREATE ---------------------------------- */
	route.post("/", middlewares.checkParams("username", "email", "password1", "password2"), async (request, response) => {
		const { username, email, password1, password2 } = request.body;

		try {
			const result = await UserModel.add(username, email, password1, password2);

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
	route.post("/login", middlewares.checkParams("email", "password"), async (request, response) => {
		const { email, password } = request.body;

		try {
			const result = await UserModel.login(email, password);

			if (result instanceof ModelError) {
				response.json(result.json()).status(result.code()).end();
			} else {
				const uid = result._id;
				const token = await TokenModel.getNew(uid);

				response.json({ uid: uid, token: token.token }).status(200).end();
			}

		} catch (err) {
			response.json({code: 500, error: err.message}).status(500).end();
		}
	});

	// TODO: Remove dev route
	route.get("/dev/all", (request, response) => {
		UserModel.getAll()
			.then(users => response.json(users).status(200).end())
			.catch(err => response.json({code: 500, error: err.message}).status(500).end());
	});

	route.get("/:uid", middlewares.checkParams("uid"), (request, response) => {
		const { uid } = request.body;

		UserModel.get(uid)
			.then(user => response.json(user || {}).status(200).end())
			.catch(err => response.json({code: 500, error: err.message}).status(500).end());
	});
};