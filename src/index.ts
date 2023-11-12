import * as cors from "cors";
import * as express from "express";
import { Router } from "express";

import { indexRoute } from "./routes/IndexRoute";
import { licenseRoute } from "./routes/LicensesRoute";
import { PORT } from "./util/config";
import { datasource } from "./util/datasource";

export type ResponseShape = {
	ok: boolean;
	message: string;
	data?: any;
};

const app = express();

const routes: Record<string, Router> = {
	"/": indexRoute,
	"/licenses": licenseRoute,
};

app.use(express.json());
app.use(cors());

for (const [route, router] of Object.entries(routes)) {
	app.use(route, router);
}

// 404
app.use("*", (req, res) => {
	res.status(404).json({ ok: false, message: "Not found." });
});

datasource.initialize().then(() => {
	console.log("Database initialized.");
	app.listen(PORT, () => {
		console.log("Server started on port 3000 : https://localhost:3000");
	});
});
