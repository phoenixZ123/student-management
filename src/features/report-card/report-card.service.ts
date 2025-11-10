import { In, Repository } from "typeorm";
import { ReportCard } from "./entity/report-card.entity";
import { AppDataSource } from "src/config/db.config";
import { ReportCardData, updateReportData } from "./type/report-card.type";
import { Student } from "../student/entity/student.entity";
import { getGrade, gradeToMark } from "./utils/report.util";

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
            // Check if the student already has a report card
            const existing = await this.reportCardRepository.findOne({
                where: { student: { student_id: Number(data.student_id) } },
                relations: ["student"],
            });

            if (existing?.id) {
                throw new Error("This student already has a report card.");
            }

            // Find the student
            const student = await this.studentRepository.findOne({
                where: { student_id: Number(data.student_id) },
            });
            if (!student) {
                throw new Error("Student not found");
            }

            // --- Calculate total using numeric fallback 0 ---
            const total =
                (data.myanmar ?? 0) +
                (data.english ?? 0) +
                (data.math ?? 0) +
                (data.chemistry ?? 0) +
                (data.physics ?? 0) +
                (data.bio ?? 0) +
                (data.eco ?? 0);

            // --- Create report card entity ---
            const reportCard = this.reportCardRepository.create({
                month: data.month,
                year: data.year,
                myanmar: data.myanmar ?? 0,
                english: data.english ?? 0,
                mathematics: data.math ?? 0,
                chemistry: data.chemistry ?? 0,
                physics: data.physics ?? 0,
                bio: data.bio ?? 0,
                eco: data.eco ?? 0,
                total: total,
                student: student
            });

            // --- Save to database ---
            const savedReportCard = await this.reportCardRepository.save(reportCard);
            return savedReportCard;

        } catch (error) {
            console.error("Error creating report card:", error);
            throw error;
        }
    }

    async getReportCard(class_id: number) {
        try {
            // Step 1: Fetch all students in the class
            const students = await this.studentRepository.find({
                where: { class_rate: { class_id: Number(class_id) } },
                relations: ['class_rate'],
            });
            console.log("student :", students);
            if (!students.length) {
                throw new Error('No students found for this class.');
            }

            // Step 2: Extract student IDs
            const studentIds = students.map(s => s.student_id);

            // Step 3: Fetch report cards for these students
            const reportCards = await this.reportCardRepository.find({
                where: { student: { student_id: In(studentIds) } },
                relations: ['student'],
            });
            console.log("report card:", reportCards);
            if (!reportCards.length) {
                throw new Error('No report cards found for these students.');
            }

            // Step 4: Flatten report card data (no nested student object)
            const flattened = reportCards.map(r => ({
                id: r.id,
                student_id: r.student!.student_id,
                name: r.student!.name,
                phone: r.student!.phone,
                address: r.student!.address,
                section: r.student!.section,
                status: r.student!.status,
                month: r.month,
                year: r.year,
                myanmar: r.myanmar,
                english: r.english,
                math: r.mathematics,
                chemistry: r.chemistry,
                physics: r.physics,
                biology: r.bio,
                ecology: r.eco,
                total: r.total,
                created_at: r.created_at,
                updated_at: r.updated_at,
            }));
            console.log("data:",);
            return flattened;

        } catch (error) {
            console.error('Error get report card:', error);
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
    // ✅ Update report card (recalculate total & grades)
    async updateReportCard(card_id: number, data: Partial<updateReportData>): Promise<any> {
        try {
            const report = await this.reportCardRepository.findOneBy({ id: card_id });
            if (!report) throw new Error("Report Card not found");

            // --- Convert existing grades to numeric marks if data missing ---
            const myanmarMark = data.myanmar ?? report.myanmar;
            const englishMark = data.english ?? report.english;
            const mathMark = data.mathematics ?? report.mathematics;
            const cheMark = data.chemistry ?? report.chemistry;
            const phyMark = data.physics ?? report.physics;
            const bioMark = data.biology ?? report.bio;
            const ecoMark = data.ecology ?? report.eco;

            // --- Recalculate total ---
            const total = Number(myanmarMark) + Number(englishMark) + Number(mathMark) + Number(cheMark) + Number(phyMark) + Number(bioMark) + Number(ecoMark);

            // --- Convert numeric marks to grades ---
            // const myanmarGrade = getGrade(myanmarMark);
            // const englishGrade = getGrade(englishMark);
            // const mathGrade = getGrade(mathMark);
            // const cheGrade = getGrade(cheMark);
            // const phyGrade = getGrade(phyMark);
            // const bioGrade = getGrade(bioMark);
            // const ecoGrade = getGrade(ecoMark);

            // --- Assign updated values ---
            report.month = data.month ?? report.month;
            report.year = data.year ?? report.year;
            report.myanmar = myanmarMark;
            report.english = englishMark;
            report.mathematics = mathMark;
            report.chemistry = cheMark;
            report.physics = phyMark;
            report.bio = bioMark;
            report.eco = ecoMark;
            report.total = total;

            return await this.reportCardRepository.save(report);

        } catch (error) {
            console.error("Error updating report card:", error);
            throw error;
        }
    }

}
