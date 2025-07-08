import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers["authorization"];
	if (!authHeader) {
		return res.status(401).json({ message: "Token tidak ada" });
	}
	if (!authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Token tidak sesuai" });
	}
	const token = authHeader.split(" ")[1];
	try {
		const secret = process.env.JWT_SECRET || "fallback-secret-key";
		const payload = jwt.verify(token, secret);
		(req as any).user = payload;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Token tidak sesuai" });
	}
}
