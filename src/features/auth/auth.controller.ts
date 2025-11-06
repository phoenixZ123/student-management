import { http_status } from "src/shared/constants/http_status";
import { AuthService } from "./auth.service";
import { loginUser } from "./dtos/user.dto";
import { Request, Response } from "express";
import { Controller, Post } from "@nestjs/common";
interface LoginUser {
    email: string;
    password: string;
}
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
    * Handle successful login
    * @param req - The request object
    * @param res - The response object
    */
    async loginUser(req: Request, res: Response) {
        try {
            const body = req.body as Partial<LoginUser>;
            console.log("user :",body);
            // Runtime validation
            const email = body.email?.trim();
            const password = body.password?.trim();

            if (!email || !password) {
                return res.status(http_status.BadRequest).json({ message: 'All Fields are required' });
            }

            // Now we know email and password exist
            const loginData: LoginUser = { email, password };

            // Call your service with a fully typed object
            const data = await this.authService.loginUser(loginData);

            res.status(http_status.Success).json({
                status: true,
                message: 'User logged in successfully',
                data:data.data,
                token:data.token
            });
        } catch (error: any) {
            console.error('Login error:', error);
            res.status(http_status.InternalServerError).json({
                status: false,
                message: 'Login failed',
                error: error.message || error,
            });
        }

    }

}