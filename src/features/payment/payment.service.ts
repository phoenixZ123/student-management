import { In, Repository } from "typeorm";
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
            const lastPayment: any = await this.paymentRepository.findOne({
                where: { student: { student_id: studentId } },
                order: { created_at: "DESC" },
            });
            if (amount > lastPayment?.credit_amount) {
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
    async getPaymentsByClass(classId: number) {
        try {
            const studentsInClass = await this.studentRepository.find({
                where: { class_rate: { class_id: classId } },
                relations: ['class_rate']
            });

            if (!studentsInClass.length) {
                return { status: false, message: "No students found in this class" };
            }

            const studentIds = studentsInClass.map((s) => s.student_id);

            const payments = await this.paymentRepository.find({
                where: { student: { student_id: In(studentIds) } },
                relations: ["student", "student.class_rate"],
                order: { payment_date: "DESC" },
            });

            if (!payments.length) {
                return { status: false, message: "No payments found for students in this class" };
            }

            const result = payments.map((p) => ({
                payment_id: p.id,
                student_id: p.student?.student_id,
                student_name: p.student?.name,
                class_id: p.student?.class_rate?.class_id ?? null,
                class_name: p.student?.class_rate?.className ?? "No class assigned",
                amount: p.amount,
                credit_amount: p.credit_amount ?? 0,
                payment_date: p.payment_date,
                payment_type: p.payment_type,
                note: p.note,
            }));

            return { status: true, message: "Payments retrieved successfully", data: result };
        } catch (error: any) {
            console.error("Error fetching class payments:", error);
            return { status: false, message: "Failed to get class payments", error: error.message };
        }
    }
    async getStudentPayment(id: number) {
        try {
            const payments: any[] = await this.paymentRepository.find({
                where: { student: { student_id: id } },
                order: { payment_date: "DESC" }, // latest first
            });

            if (!payments.length) {
                throw new Error("Student has no payments yet");
            }

            const data = payments.map(payment => {
                // Safely format date
                const formattedDate = payment.payment_date
                    ? `${payment.payment_date.getFullYear()}-${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(payment.payment_date)}-${payment.payment_date.getDate().toString().padStart(2, '0')}`
                    : null;

                return {
                    amount: payment.amount,
                    note: payment.note,
                    credit_amount: payment.credit_amount,
                    payment_type: payment.payment_type,
                    date: formattedDate,
                };
            });

            return data;

        } catch (error) {
            console.error("Error fetching payments:", error);
            throw error;
        }

    }

}