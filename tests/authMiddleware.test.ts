import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../src/middlewares/authMiddleware";
import jwt from "jsonwebtoken";

describe("Auth Middleware", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: NextFunction;

	beforeEach(() => {
		req = {
			headers: {}
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis()
		};
		next = jest.fn();
	});

	describe("Token validation", () => {
		it("should return 401 when authorization header is missing", () => {
			authMiddleware(req as Request, res as Response, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ message: "Token tidak ada" });
			expect(next).not.toHaveBeenCalled();
		});

		it("should return 401 when authorization header is empty", () => {
			req.headers!["authorization"] = "";
			authMiddleware(req as Request, res as Response, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ message: "Token tidak ada" });
			expect(next).not.toHaveBeenCalled();
		});

		it("should return 401 when token doesn't start with Bearer", () => {
			req.headers!["authorization"] = "InvalidToken";
			authMiddleware(req as Request, res as Response, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ message: "Token tidak sesuai" });
			expect(next).not.toHaveBeenCalled();
		});

		it("should return 401 when token format is invalid (no space after Bearer)", () => {
			req.headers!["authorization"] = "BearerInvalidToken";
			authMiddleware(req as Request, res as Response, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ message: "Token tidak sesuai" });
			expect(next).not.toHaveBeenCalled();
		});

		it("should return 401 when JWT token is invalid", () => {
			req.headers!["authorization"] = "Bearer invalid-jwt-token";
			authMiddleware(req as Request, res as Response, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ message: "Token tidak sesuai" });
			expect(next).not.toHaveBeenCalled();
		});

		it("should return 401 when JWT token is malformed", () => {
			req.headers!["authorization"] = "Bearer not.a.valid.jwt.token";
			authMiddleware(req as Request, res as Response, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ message: "Token tidak sesuai" });
			expect(next).not.toHaveBeenCalled();
		});

		it("should return 401 when JWT token is expired", () => {
			const secret = process.env.JWT_SECRET || "fallback-secret-key";
			const expiredToken = jwt.sign(
				{ userId: "test-user", email: "test@example.com" },
				secret,
				{ expiresIn: "-1h" }
			);
			req.headers!["authorization"] = `Bearer ${expiredToken}`;

			authMiddleware(req as Request, res as Response, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ message: "Token tidak sesuai" });
			expect(next).not.toHaveBeenCalled();
		});

		it("should call next() when token is valid", () => {
			const secret = process.env.JWT_SECRET || "fallback-secret-key";
			const validToken = jwt.sign(
				{ userId: "test-user", email: "test@example.com" },
				secret,
				{ expiresIn: "1h" }
			);
			req.headers!["authorization"] = `Bearer ${validToken}`;

			authMiddleware(req as Request, res as Response, next);

			expect(next).toHaveBeenCalled();
			expect((req as any).user).toBeDefined();
			expect((req as any).user.userId).toBe("test-user");
			expect((req as any).user.email).toBe("test@example.com");
		});

		it("should handle JWT signed with different secret", () => {
			const wrongSecret = "wrong-secret-key";
			const tokenWithWrongSecret = jwt.sign(
				{ userId: "test-user", email: "test@example.com" },
				wrongSecret,
				{ expiresIn: "1h" }
			);
			req.headers!["authorization"] = `Bearer ${tokenWithWrongSecret}`;

			authMiddleware(req as Request, res as Response, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ message: "Token tidak sesuai" });
			expect(next).not.toHaveBeenCalled();
		});

		it("should handle token with missing Bearer space", () => {
			req.headers!["authorization"] = "Bearer";
			authMiddleware(req as Request, res as Response, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ message: "Token tidak sesuai" });
			expect(next).not.toHaveBeenCalled();
		});

		it("should handle Bearer token with only spaces", () => {
			req.headers!["authorization"] = "Bearer    ";
			authMiddleware(req as Request, res as Response, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ message: "Token tidak sesuai" });
			expect(next).not.toHaveBeenCalled();
		});
	});

	describe("Environment handling", () => {
		it("should use fallback secret when JWT_SECRET is not set", () => {
			const originalSecret = process.env.JWT_SECRET;
			delete process.env.JWT_SECRET;

			const fallbackSecret = "fallback-secret-key";
			const validToken = jwt.sign(
				{ userId: "test-user", email: "test@example.com" },
				fallbackSecret,
				{ expiresIn: "1h" }
			);
			req.headers!["authorization"] = `Bearer ${validToken}`;

			authMiddleware(req as Request, res as Response, next);

			expect(next).toHaveBeenCalled();
			expect((req as any).user).toBeDefined();

			// Restore original environment
			if (originalSecret) {
				process.env.JWT_SECRET = originalSecret;
			}
		});
	});
});
