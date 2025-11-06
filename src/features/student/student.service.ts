import { Repository } from "typeorm";
import { IStudentInterface } from "./interface/student.interface";
import { Student } from "./entity/student.entity";
import { AppDataSource } from "src/config/db.config";

export class StudentService implements IStudentInterface {
    private studentRepository: Repository<Student>;

    constructor() {
        this.studentRepository = AppDataSource.getRepository(Student);
    }
}