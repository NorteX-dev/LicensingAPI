import type { Express } from "express";
import { Database } from "./Database";
import * as express from "express";
import * as cors from "cors";
import IndexRoute from "../routes/IndexRoute";
import LicensesRoute from "../routes/LicensesRoute";
import { PORT } from "../util/config";

const ROUTES = {
	"/": new IndexRoute(),
	"/licenses": new LicensesRoute(),
};

export class Server {
	private app: Express;
	private database: Database;
	private readonly routes: any;

	constructor(database: Database) {
		this.app = express();
		this.database = database;
		this.routes = ROUTES;
	}

	setup() {
		this.middleware();
		this.listen();
	}

	middleware() {
		this.app.use(express.json());
		this.app.use(cors());

		for (const route in this.routes) {
			this.app.use(route, this.routes[route].router);
		}

		// 404
		this.app.use("*", (req, res) => {
			res.status(404).json({ ok: false, message: "Not found." });
		});
	}

	listen() {
		this.database.sync().then(() => {
			console.log("Database synchronised.");
			this.app.listen(PORT, () => {
				console.log("Server started on port 3000 : https://localhost:3000");
			});
		});
	}
}
