import * as express from "express";
import { IResponse } from "../interfaces/IResponse";
import { Request, Response } from "express";

export default class IndexRoute {
	private router: express.Router;

	constructor() {
		this.router = express.Router();
		this.middleware();
	}

	middleware() {
		this.router.get("/", (req: Request, res: Response<IResponse>) => {
			res.status(200).json({ ok: true, message: "Licensing system version 1" });
		});
	}
}
