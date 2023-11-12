import { Request, Response, Router } from "express";

import { ResponseShape } from "../index";

const router = Router();
export { router as indexRoute };

router.get("/", (req: Request, res: Response<ResponseShape>) => {
	res.status(200).json({ ok: true, message: "Licensing system" });
});
