import { Router } from "express";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";
import { authenticate } from "../auth/middlewares/auth.middleware";

const router = Router();
const studentService = new StudentService();
const studentController = new StudentController(studentService);
router.post("/add-student", authenticate, studentController.addStudent.bind(studentController));
export default router;