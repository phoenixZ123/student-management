import { Repository } from "typeorm";
import { IStudentInterface } from "./interface/student.interface";
import { Student } from "./entity/student.entity";
import { AppDataSource } from "src/config/db.config";
import { StudentObj } from "./type/student.type";
import { error } from "console";

export class StudentService implements IStudentInterface {
    private studentRepository: Repository<Student>;

    constructor() {
        this.studentRepository = AppDataSource.getRepository(Student);
    }

    // ✅ Accept Partial<StudentObj> so TypeScript doesn’t complain
    async addStudent(stu: Partial<StudentObj>): Promise<Student> {
        try {
            if (!stu.name || !stu.phone || !stu.address || !stu.section) {
                throw new Error("Missing required fields in service");
            }
            stu.class_id = Number(stu.class_id);
            const create = this.studentRepository.create(stu);
            return await this.studentRepository.save(create);
        } catch (error) {
            console.error("Error adding student:", error);
            throw error;
        }
    }
    async getAllStudent(): Promise<any> {
        try {
            return await this.studentRepository.find({ relations: ['class_rate'] });
        } catch (error) {
            console.error("Error get students:", error);
            throw error;
        }
    }
    async gradeByStudent(class_id: number): Promise<any> {
        try {
            const studentsRaw = await this.studentRepository
                .createQueryBuilder("student")
                .leftJoin("student.class_rate", "class_rate")
                .select([
                    "student.student_id",
                    "student.name",
                    "student.phone",
                    "student.address",
                    "student.section",
                    "student.status",   
                    "class_rate.class_id",   
                    "class_rate.className"
                ])
                .where("class_rate.class_id = :class_id", { class_id })
                .getRawMany();

            // Map to clean object
            const students = studentsRaw.map(s => ({
                id: s.student_student_id,
                name: s.student_name,
                phone: s.student_phone,
                address: s.student_address,
                section: s.student_section,
                status: s.student_status,     // student status included
                class_id:s.class_rate_class_id,
                className: s.class_rate_className // className directly
            }));
            console.log(students);

            return students;
        } catch (error) {
            console.error("Error get grade by students:", error);
            throw error;
        }
    }
    async deleteStudent(id: number) {
        try {
            const result = await this.studentRepository.delete({ student_id: Number(id) });
            if (result.affected === 0) {
                throw new error("Class not found");
            }
            if (result) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error delete student:", error);
            throw error;
        }

    }
    async updateStudent(id: number, data: Partial<Student>) {
        try {
            const student = await this.studentRepository.findOneBy({ student_id: id });
            if (!student) {
                throw new Error('Student not found');
            }
            Object.assign(student, data);

            // Save the updated entity
            return await this.studentRepository.save(student);
        } catch (error) {
            console.error("Error update students:", error);
            throw error;
        }

    }
}
