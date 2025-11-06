import { StudentService } from "./student.service";

export class StudentController{
    private studentService:StudentService;
    constructor(){
        this.studentService=new StudentService();
    }
}