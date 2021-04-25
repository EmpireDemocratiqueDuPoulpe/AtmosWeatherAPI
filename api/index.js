import { Router } from "express";
import users from "./routes/users.js";
import cities from "./routes/cities.js";

export default () => {
	const router = Router();

	users(router);
	cities(router);

	return router;
};