import express from "express";
import http from "http";
import https from "https";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import fs from "fs";
import config from "./config/config.js";
import apiRoutes from "./api/index.js";

async function startServer() {
	// Set up HTTPS
	const key  = fs.readFileSync("./certs/key.pem", "utf8");
	const cert  = fs.readFileSync("./certs/cert.pem", "utf8");
	const opts = { key: key, cert: cert };

	const app = express();
	const server = http.createServer(app);
	const secureServer = https.createServer(opts, app);
	const port = config.app.port || 3000;
	const securePort = config.app.securePort || 3443;

	// Check if the server is still alive
	app.get("/status", (request, response) => {
		response.status(200).end();
	});

	// Enable CORS middleware
	// noinspection JSCheckFunctionSignatures
	app.use(cors());

	// Transform raw into pretty JSON
	app.use(bodyParser.json());

	// Start connection to database
	mongoose.connect(config.db.url, { useNewUrlParser: true, useUnifiedTopology: true })
		.catch(console.error);

	// Add API routes
	app.use(config.api.prefix, apiRoutes());

	// Handle 404
	app.use((request, response, next) => {
		response.status(404).end();
		next();
	});

	// Start listening
	server.listen(port, () => {
		console.log(getStartedMessage("http", port));
	}).on("error", err => {
		console.error(err);
		process.exit(1);
	});

	secureServer.listen(securePort, () => {
		console.log(getStartedMessage("https", securePort));
	}).on("error", err => {
		console.error(err);
		process.exit(1);
	});
}

function getStartedMessage(protocol, port) {
	return "############## AtmosWeather API ##############\n" +
		`Server started. Listening on port ${port} (${protocol}).\n` +
		"##############################################";
}

startServer().catch(console.error);