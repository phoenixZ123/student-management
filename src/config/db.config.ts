import { ClassRate } from "src/features/class-rate/entity/class-rate.entity";
import { Payment } from "src/features/payment/entity/payment.entity";
import { ReportCard } from "src/features/report-card/entity/report-card.entity";
import { Student } from "src/features/student/entity/student.entity";
import { UserSession } from "src/features/auth/entity/session.entity";
import { User } from "src/features/auth/entity/user.entity";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: (process.env.TYPE as any) || "postgres",
    host: process.env.HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5433,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "admin",
    database: process.env.DB_NAME || "student-management",
    synchronize: true,
    logging: true,
    entities: [User, UserSession, Student, ClassRate, Payment, ReportCard],
    subscribers: [],
    migrations: [],
})