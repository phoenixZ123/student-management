import { Repository } from "typeorm";
import { ReportCard } from "./entity/report-card.entity";
import { AppDataSource } from "src/config/db.config";
import { ReportCardData, updateReportData } from "./type/report-card.type";
import { Student } from "../student/entity/student.entity";

export class ReportCardService {
    private reportCardRepository: Repository<ReportCard>;
    private studentRepository: Repository<Student>;

    constructor() {
        this.reportCardRepository = AppDataSource.getRepository(ReportCard);
        this.studentRepository = AppDataSource.getRepository(Student);
    }

    // Create a new report card linked to a student
    async createReportCard(data: ReportCardData): Promise<ReportCard> {
        try {
            const user = await this.reportCardRepository.findOne({
                where: { student: { student_id: Number(data.student_id) } },
                relations: ["student"], // optional if you want the student data
            });

            if (user?.id) {
                throw new Error("This student already has a report card.");
            }
            // Find the student first
            const student = await this.studentRepository.findOne({
                where: { student_id: Number(data.student_id)}
            });

            if (!student) {
                throw new Error("Student not found");
            }

            const total = data.myanmar + data.english + data.math + data.chemistry + data.physics + (data.bio ?? 0) +
                (data.eco ?? 0);
            data.total = total;
            // Create report card entity and assign student
            const reportCard = this.reportCardRepository.create({
                ...data,
                student: student  // link the relation
            });

            // Save to database
            const savedReportCard = await this.reportCardRepository.save(reportCard);
            return savedReportCard;
        } catch (error) {
            console.error("Error creating report card:", error);
            throw error;
        }
    }
    async getReportCard(student_id: number) {
        try {
            return await this.reportCardRepository.findOne({
                where: {
                    student: { student_id: student_id }
                },
                relations: ["student"],
            });
        } catch (error) {
            console.error("Error get report card:", error);
            throw error;
        }
    }
    async deleteReportCard(card_id: number) {
        try {
            return await this.reportCardRepository.delete({ id: card_id });
        } catch (error) {
            console.error("Error delete report card:", error);
            throw error;
        }
    }
    async updateReportCard(card_id: number, data: Partial<updateReportData>): Promise<any> {
        try {
            const report = await this.reportCardRepository.findOneBy({ id: card_id });
            if (!report) {
                throw new Error('Report Card not found');
            }
            data.total = (data.myanmar ?? report.myanmar) + (data.english ?? report.english) + (data.mathematics ?? report.mathematics) + (data.chemistry ?? report.chemistry) +( data.physics ?? report.physics) + (data.bio ?? 0) +
                (data.eco ?? 0);
            Object.assign(report, data);

            return await this.reportCardRepository.save(report);
        } catch (error) {
            console.error("Error update report card:", error);
            throw error;
        }
    }
}
