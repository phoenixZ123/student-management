import { Repository } from "typeorm";
import { Payment } from "./entity/payment.entity";
import { AppDataSource } from "src/config/db.config";
import { IPaymentInterface } from "./interface/payment.interface";
import { paymentDto } from "./dtos/payment.dto";

export class PaymentService implements IPaymentInterface {
    private paymentRepository: Repository<Payment>;
    constructor() {
        this.paymentRepository = AppDataSource.getRepository(Payment);
    }
    async createPayment(data: paymentDto) {
        try {
            // Convert numeric strings to number
            const amount = Number(data.amount);
            const studentId = Number(data.student_id);

            // Create entity instance
            const payment = this.paymentRepository.create({
                amount: amount,
                payment_type: data.payment_type,
                student: { student_id: studentId } // link relation
            });

            // Save to DB
            return await this.paymentRepository.save(payment);
        } catch (error) {
            console.error("Error creating payment:", error);
            return {
                status: false,
                message: "Failed to create payment",
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }

}