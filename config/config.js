const config = {
	app: {
		port: 8080,
		security: {
			saltRound: 10
		}
	},
	db: {
		url: "mongodb://localhost:27017/AtmosWeatherDB"
	},
	api: {
		prefix: "/api"
	}
};

export default config;