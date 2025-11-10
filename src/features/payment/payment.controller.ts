import { Request, Response } from "express";
import { http_status } from "src/shared/constants/http_status";
import { paymentDto } from "./dtos/payment.dto";
import { PaymentService } from "./payment.service";

export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    async create(req: Request, res: Response) {
        try {
            // Safe cast for request body
            const payment = req.body as unknown as paymentDto;

            // Optional: validate required fields
            if (!payment.amount || !payment.payment_type || !payment.student_id) {
                return res.status(http_status.BadRequest).json({
                    status: false,
                    message: "Missing required fields",
                });
            }

            const data = await this.paymentService.createPayment(payment);

            if (!data) {
                return res.status(http_status.BadRequest).json({
                    status: false,
                    message: "Payment cannot create",
                });
            }


            return res.status(http_status.Success).json({
                status: true,
                message: "Payment Created Successfully",
                data: data,
            });
        } catch (error) {
            console.error("Error creating payment:", error);
            return res.status(http_status.InternalServerError).json({
                status: false,
                message: "Failed to create payment",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async getPayment(req: Request, res: Response) {
        try {
            const { id } = req.query as { id?: string };
            const data = await this.paymentService.getPaymentsByClass(Number(id));
            return res.status(http_status.Success).json(data);
        } catch (error) {
            console.error("Error get payment:", error);
            return res.status(http_status.InternalServerError).json({
                status: false,
                message: "Failed to get payment",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async getStudentPayment(req: Request, res: Response) {
        try {
            const { id } = req.query as { id?: string };
            const data = await this.paymentService.getStudentPayment(Number(id));
            if (data.length == 0) {
                return res.status(http_status.Success).json({
                    status: true,
                    message: "Empty student payment",
                    data
                })
            }
            return res.status(http_status.Success).json({
                status: true,
                message: "Student Payment",
                data
            })
        } catch (error) {
            console.error("Error get payment:", error);
            return res.status(http_status.InternalServerError).json({
                status: false,
                message: "Failed to get payment",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
}
