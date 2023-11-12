import type { NextFunction, Request, Response } from "express";

import { API_KEY } from "./config";

export const authenticateApiKey = (req: Request, res: Response, next: NextFunction) => {
	const apiKey = req.headers["x-api-key"] as string;
	if (!apiKey) {
		return res.status(401).json({ ok: false, message: "No API key provided." });
	}
	if (!API_KEY.includes(apiKey)) {
		return res.status(401).json({ ok: false, message: "Invalid API key." });
	}
	next();
};
