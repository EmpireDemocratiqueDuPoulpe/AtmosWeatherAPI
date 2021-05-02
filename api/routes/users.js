import { Router } from "express";
import middlewares from "../middlewares/index.js";
import UserModel from "../models/UserModel.js";
import TokenModel from "../models/TokenModel.js";
import ModelError from "../../global/ModelError.js";

const route = Router();

export default (router) => {
	router.use("/users", route);

	/* ---- CREATE ---------------------------------- */
	route.post("/", middlewares.checkParams("username", "email", "password1", "password2"), async (request, response) => {
		const { username, email, password1, password2 } = request.body;

		try {
			const result = await UserModel.add(username, email, password1, password2);

			if (result instanceof ModelError) {
				response.status(result.code()).json(result.json()).end();
			} else {
				response.status(202).end();
			}

		} catch (err) {
			response.status(500).json({code: 500, error: err.message}).end();
		}
	});

	/* ---- READ ------------------------------------ */
	route.post("/login", middlewares.checkParams("email", "password"), async (request, response) => {
		const { email, password } = request.body;

		try {
			const result = await UserModel.login(email, password);

			if (result instanceof ModelError) {
				response.status(result.code()).json(result.json()).end();
			} else {
				const uid = result._id;
				const username = result.username;
				const token = await TokenModel.getNew(uid);

				response.status(200).json({ uid: uid, username: username, token: token.token }).end();
			}

		} catch (err) {
			response.status(500).json({code: 500, error: err.message}).end();
		}
	});

	// TODO: Remove dev route
	route.get("/dev/all", (request, response) => {
		UserModel.getAll()
			.then(users => response.status(200).json(users).end())
			.catch(err => response.status(500).json({code: 500, error: err.message}).end());
	});

	route.get("/:uid", middlewares.checkParams("uid"), (request, response) => {
		const { uid } = request.body;

		UserModel.get(uid)
			.then(user => response.status(200).json(user || {}).end())
			.catch(err => response.status(500).json({code: 500, error: err.message}).end());
	});
};