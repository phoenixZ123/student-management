import { Controller } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { http_status } from "src/shared/constants/http_status";

interface LoginUser {
    email: string;
    password: string;
}

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    async loginUser(req: Request, res: Response) {
        try {
            const { email, password } = req.body as Partial<LoginUser>;

            if (!email || !password) {
                return res.status(http_status.BadRequest).json({
                    status: false,
                    message: "All fields are required",
                });
            }

            const data = await this.authService.loginUser({ email, password });

            return res.status(http_status.Success).json({
                status: true,
                message: "User logged in successfully",
                data, // ✅ token is included in data
            });
        } catch (error: any) {
            console.error("Login error:", error);
            return res.status(http_status.InternalServerError).json({
                status: false,
                message: "Login failed",
                error: error.message || error,
            });
        }
    }
}
