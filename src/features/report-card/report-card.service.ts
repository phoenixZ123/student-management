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
                where: { student_id: Number(data.student_id) }
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

            // --- Convert marks to grades safely ---
            const myanmarGrade = getGrade(data.myanmar ?? 0);
            const englishGrade = getGrade(data.english ?? 0);
            const mathGrade = getGrade(data.math ?? 0);
            const chemistryGrade = getGrade(data.chemistry ?? 0);
            const physicsGrade = getGrade(data.physics ?? 0);
            const bioGrade = getGrade(data.bio ?? 0);
            const ecoGrade = getGrade(data.eco ?? 0);

            // --- Create report card entity ---
            const reportCard = this.reportCardRepository.create({
                month: data.month,
                year: data.year,
                myanmar: myanmarGrade,
                english: englishGrade,
                mathematics: mathGrade,
                chemistry: chemistryGrade,
                physics: physicsGrade,
                bio: bioGrade,
                eco: ecoGrade,
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
            // Step 1: Get all students belonging to this class
            const students = await this.studentRepository.find({
                where: { class_rate: { class_id } },
                relations: ['class_rate'],
            });

            if (!students.length) {
                throw new Error('No students found for this class.');
            }

            // Step 2: Extract student IDs
            const studentIds = students.map((student) => student.student_id);

            // Debug logs (optional)
            console.log('Student IDs:', studentIds);

            // Step 3: Find report cards for all those students
            const reportCards = await this.reportCardRepository.find({
                where: {
                    student: {
                        student_id: In(studentIds),
                    },
                },
                relations: ['student'], // include student info
            });

            if (!reportCards.length) {
                throw new Error('No report cards found for these students.');
            }

            // Step 4: Return a structured response
            return reportCards;
        } catch (error: any) {
            console.error('Error get report card:', error);
            return {
                status: false,
                message: 'Something went wrong',
                error: error.message || error,
            };
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
            const myanmarMark = data.myanmar ?? gradeToMark(report.myanmar);
            const englishMark = data.english ?? gradeToMark(report.english);
            const mathMark = data.mathematics ?? gradeToMark(report.mathematics);
            const cheMark = data.chemistry ?? gradeToMark(report.chemistry);
            const phyMark = data.physics ?? gradeToMark(report.physics);
            const bioMark = data.bio ?? gradeToMark(report.bio);
            const ecoMark = data.eco ?? gradeToMark(report.eco);

            // --- Recalculate total ---
            const total = myanmarMark + englishMark + mathMark + cheMark + phyMark + bioMark + ecoMark;

            // --- Convert numeric marks to grades ---
            const myanmarGrade = getGrade(myanmarMark);
            const englishGrade = getGrade(englishMark);
            const mathGrade = getGrade(mathMark);
            const cheGrade = getGrade(cheMark);
            const phyGrade = getGrade(phyMark);
            const bioGrade = getGrade(bioMark);
            const ecoGrade = getGrade(ecoMark);

            // --- Assign updated values ---
            report.month = data.month ?? report.month;
            report.year = data.year ?? report.year;
            report.myanmar = myanmarGrade;
            report.english = englishGrade;
            report.mathematics = mathGrade;
            report.chemistry = cheGrade;
            report.physics = phyGrade;
            report.bio = bioGrade;
            report.eco = ecoGrade;
            report.total = total;

            return await this.reportCardRepository.save(report);

        } catch (error) {
            console.error("Error updating report card:", error);
            throw error;
        }
    }

}
