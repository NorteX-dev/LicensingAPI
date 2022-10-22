import * as express from "express";
import { IResponse } from "../interfaces/IResponse";
import { Request, Response } from "express";
import License from "../models/License";
import { authenticateApiKey } from "../middleware/authenticateApiKey";

export default class LicensesRoute {
	private router: express.Router;

	constructor() {
		this.router = express.Router();
		this.middleware();
	}

	middleware() {
		/*
		 * GET /licenses - Get all
		 * */
		this.router.get("/", authenticateApiKey, (req: Request, res: Response<IResponse>) => {
			res.status(405).json({ ok: true, message: "Method not allowed." });
		});

		/*
		 * POST /licenses - Create license
		 * */
		this.router.post("/", authenticateApiKey, async (req: Request, res: Response<IResponse>) => {
			const { label, exp } = req.body;
			if (!label) return res.status(400).json({ ok: false, message: "Missing required body fields: label." });
			let date;
			if (exp) {
				date = new Date(exp);
				if (isNaN(date.getTime())) return res.status(400).json({ ok: false, message: "Invalid date." });
			}
			License.create({
				label,
				exp: date,
			})
				.then((license) => {
					res.status(405).json({ ok: true, message: "License created.", data: { license } });
				})
				.catch((err) => {
					console.log(err);
					return res.status(500).json({ ok: false, message: "Internal server error." });
				});
		});

		/*
		 * GET /licenses/:id - Get by id
		 * */
		this.router.get("/:id", authenticateApiKey, async (req: Request, res: Response<IResponse>) => {
			const id = req.params.id;
			const license = await License.findByPk(id);
			if (!license) return res.status(404).json({ ok: false, message: "License not found." });
			res.status(200).json({ ok: true, message: "License found.", data: license.sanitised });
		});

		/*
		 * GET /licenses/validate/:key - Validate if a license is valid by its key
		 * */
		this.router.get("/validate/:key", async (req: Request, res: Response<IResponse>) => {
			const key = req.params.key;
			const license = await License.findOne({ where: { key } });
			if (!license)
				return res.status(200).json({ ok: true, message: "License not found.", data: { status: "invalid" } });
			if (license.valid)
				res.status(200).json({ ok: true, message: "License is valid.", data: { status: "valid" } });
			else res.status(200).json({ ok: true, message: "License is invalid.", data: { status: "invalid" } });
		});

		this.router.get("/validate/:key/info", async (req: Request, res: Response<IResponse>) => {
			const key = req.params.key;
			const license = await License.findOne({ where: { key } });
			if (!license)
				return res.status(200).json({ ok: true, message: "License not found.", data: { status: "invalid" } });
			res.status(200).json({
				ok: true,
				message: "License found.",
				data: { status: license.valid ? "valid" : "invalid", license: license.sanitised },
			});
		});

		/*
		 * PATCH /:id - Fully edit by id
		 * */
		this.router.patch("/:id", authenticateApiKey, async (req: Request, res: Response<IResponse>) => {
			const { id } = req.params;
			const license = await License.findByPk(id);
			const { label, exp } = req.body;
			if (!label) return res.status(400).json({ ok: false, message: "Missing required body fields: label." });
			let date;
			if (exp) {
				date = new Date(exp);
				if (isNaN(date.getTime())) return res.status(400).json({ ok: false, message: "Invalid date." });
			}
			license.label = label;
			license.exp = date;
			license
				.save()
				.then((newLicense) => {
					res.status(200).json({ ok: true, message: "License updated.", data: { license: newLicense } });
				})
				.catch((err) => {
					console.log(err);
					return res.status(500).json({ ok: false, message: "Internal server error." });
				});
		});

		/*
		 * PUT /:id - Partially edit by id
		 */
		this.router.put("/:id", authenticateApiKey, async (req: Request, res: Response<IResponse>) => {
			const { id } = req.params;
			const license = await License.findByPk(id);
			if (!license) return res.status(404).json({ ok: false, message: "License not found." });
			const { label, exp } = req.body;
			if (label) {
				license.label = label;
			}
			if (exp) {
				const date = new Date(exp);
				if (isNaN(date.getTime())) return res.status(400).json({ ok: false, message: "Invalid date." });
				license.exp = date;
			}
			license
				.save()
				.then((newLicense) => {
					res.status(200).json({ ok: true, message: "License updated.", data: { license: newLicense } });
				})
				.catch((err) => {
					console.log(err);
					return res.status(500).json({ ok: false, message: "Internal server error." });
				});
		});

		/*
		 * DELETE /:id - Delete by id
		 */
		this.router.delete("/:id", authenticateApiKey, async (req: Request, res: Response<IResponse>) => {
			const { id } = req.params;
			const license = await License.findByPk(id);
			if (!license) return res.status(404).json({ ok: false, message: "License not found." });
			license
				.destroy()
				.then(() => {
					res.status(200).json({ ok: true, message: "License deleted." });
				})
				.catch((err) => {
					console.log(err);
					return res.status(500).json({ ok: false, message: "Internal server error." });
				});
		});
	}
}
