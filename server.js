import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config/config.js";
import apiRoutes from "./api/index.js";

// TODO: Enable HTTPS
async function startServer() {
	const app = express();
	const port = config.app.port || 3000;

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
	// Todo: Redirect to 404 page
	app.use((request, response, next) => {
		response.status(404).end();
		next();
	});

	// Start listening
	app.listen(port, () => {
		console.log(`
      ############## AtmosWeather ###############
       Server started. Listening on port ${port}.
      ###########################################
    `);
	}).on("error", err => {
		console.error(err);
		process.exit(1);
	});
}

startServer().catch(console.error);

/*
// Static files from react app
app.use(express.static(path.join(__dirname, "client/build")));

// API routes
app.get("/api/temp", (request, response) => {
  const list = ["item1", "item2", "item3"];
  response.json(list);
});

// React app
app.get("*", (request, response) => {
  response.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

app.listen(port);
console.log(`Server started. Listening on port ${port}.`);*/