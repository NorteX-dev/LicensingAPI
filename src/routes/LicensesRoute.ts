import { Request, Response, Router } from "express";
import { z } from "zod";

import { ResponseShape } from "../index";
import License from "../models/License";
import { authenticateApiKey } from "../util/authenticateApiKey";

const router = Router();
export { router as licenseRoute };

/*
 * GET /licenses - Get all
 * */
router.get("/", authenticateApiKey, async (req: Request, res: Response<ResponseShape>) => {
	let queryParamsShape = z.object({
		page: z.string(),
	});

	const qsParsingResults = queryParamsShape.safeParse(req.query);
	if (!qsParsingResults.success) return res.status(400).json({ ok: false, message: "Invalid query parameters.", data: qsParsingResults.error });

	const perPage = 10;
	let page = parseInt(qsParsingResults.data.page);
	if (!page || isNaN(page)) page = 1;
	const licenses = await License.find({
		order: { createdAt: "DESC" },
		take: perPage,
		skip: (page - 1) * perPage,
	});
	res.json({
		ok: true,
		message: "Licenses found.",
		data: { licenses: licenses.map((l) => l.sanitised), pages: { current: page, total: Math.ceil((await License.count()) / perPage) } },
	});
});

/*
 * POST /licenses - Create license
 * */
router.post("/", authenticateApiKey, async (req: Request, res: Response<ResponseShape>) => {
	let bodyShape = z.object({
		label: z.string(),
		exp: z.string().optional(),
	});

	const bodyParsingResult = bodyShape.safeParse(req.query);
	if (!bodyParsingResult.success) {
		return res.status(400).json({ ok: false, message: "Invalid body.", data: { issues: bodyParsingResult.error.issues } });
	}

	const { label, exp } = bodyParsingResult.data;

	const license = License.create();
	license.label = label;
	if (exp) {
		let date = new Date(exp);
		if (isNaN(date.getTime())) {
			return res.status(400).json({ ok: false, message: "Invalid date." });
		}
		license.exp = date;
	}

	await license.save();
	res.status(405).json({ ok: true, message: "License created.", data: { license } });
});

/*
 * GET /licenses/:id - Get by id
 * */
router.get("/:id", authenticateApiKey, async (req: Request, res: Response<ResponseShape>) => {
	const id = req.params.id;
	const license = await License.findOne({ where: { id } });
	if (!license) return res.status(404).json({ ok: false, message: "License not found." });
	res.status(200).json({ ok: true, message: "License found.", data: license.sanitised });
});

/*
 * GET /licenses/validate/:key - Validate if a license is valid by its key
 * */
router.get("/validate/:key", async (req: Request, res: Response<ResponseShape>) => {
	const key = req.params.key;
	const license = await License.findOne({ where: { key } });
	if (!license) return res.status(200).json({ ok: true, message: "License not found.", data: { status: "invalid" } });
	if (license.unexpired) res.status(200).json({ ok: true, message: "License is valid.", data: { status: "valid" } });
	else res.status(200).json({ ok: true, message: "License is invalid.", data: { status: "invalid" } });
});

router.get("/validate/:key/info", async (req: Request, res: Response<ResponseShape>) => {
	const key = req.params.key;
	const license = await License.findOne({ where: { key } });
	if (!license) return res.status(200).json({ ok: true, message: "License not found.", data: { status: "invalid" } });
	res.status(200).json({
		ok: true,
		message: "License found.",
		data: { status: license.unexpired ? "valid" : "invalid", license: license.sanitised },
	});
});

/*
 * PUT /:id - Edit by id
 */
router.put("/:id", authenticateApiKey, async (req: Request, res: Response<ResponseShape>) => {
	const { id } = req.params;
	const license = await License.findOne({ where: { id } });
	if (!license) return res.status(404).json({ ok: false, message: "License not found." });

	let bodyShape = z.object({
		label: z.string().optional(),
		exp: z.date().optional(),
	});

	const bodyParsingResult = bodyShape.safeParse(req.query);
	if (!bodyParsingResult.success) {
		return res.status(400).json({ ok: false, message: "Invalid body.", data: { issues: bodyParsingResult.error.issues } });
	}

	const { label, exp } = bodyParsingResult.data;

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
router.delete("/:id", authenticateApiKey, async (req: Request, res: Response<ResponseShape>) => {
	const { id } = req.params;
	const license = await License.findOne({ where: { id } });
	if (!license) return res.status(404).json({ ok: false, message: "License not found." });
	license
		.remove()
		.then(() => {
			res.status(200).json({ ok: true, message: "License deleted." });
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({ ok: false, message: "Internal server error." });
		});
});
