import { Repository } from "typeorm";
import { Payment } from "./entity/payment.entity";
import { AppDataSource } from "src/config/db.config";
import { IPaymentInterface } from "./interface/payment.interface";
import { paymentDto } from "./dtos/payment.dto";
import { Student } from "../student/entity/student.entity";

export class PaymentService implements IPaymentInterface {
    private paymentRepository: Repository<Payment>;
    private studentRepository: Repository<Student>;
    constructor() {
        this.paymentRepository = AppDataSource.getRepository(Payment);
        this.studentRepository = AppDataSource.getRepository(Student);

    }
    async createPayment(data: paymentDto) {
        try {
            const amount = Number(data.amount);
            const studentId = Number(data.student_id);

            // Step 1: Fetch student with class info
            const student = await this.studentRepository.findOne({
                where: { student_id: studentId },
                relations: ['class_rate'],
            });

            if (!student) {
                throw new Error("Student not found");
            }

            if (!student.class_rate) {
                throw new Error("Student has no class assigned");
            }

            // Step 2: Fetch latest payment to get last left_amount
            const lastPayment:any = await this.paymentRepository.findOne({
                where: { student: { student_id: studentId } },
                order: { created_at: "DESC" },
            });
             if(amount > lastPayment?.credit_amount){
                    return false;
                }

            const lastLeftAmount = lastPayment?.credit_amount ?? student.class_rate.classRate;

            // Step 3: Check if left_amount is already 0
            if (lastLeftAmount <= 0) {
                return false;
            }

            // Step 4: Calculate new left amount
            let newLeftAmount = lastLeftAmount - amount;
            if (newLeftAmount < 0) newLeftAmount = 0;

            // Step 5: Create payment entity
            if (amount <= student.class_rate.classRate) {
                const payment = this.paymentRepository.create({
                    amount: amount,
                    payment_type: data.payment_type,
                    payment_date: data.payment_date,
                    note: data.note,
                    credit_amount: newLeftAmount,
                    student: { student_id: studentId },
                });

                // Step 6: Save payment
                return await this.paymentRepository.save(payment);
            }


        } catch (error) {
            console.error("Error creating payment:", error);
            return {
                status: false,
                message: "Failed to create payment",
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }


}