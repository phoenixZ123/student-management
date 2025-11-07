import { Request, Response } from "express";
import { StudentService } from "./student.service";
import { StudentObj } from "./type/student.type";
import { http_status } from "src/shared/constants/http_status";
import { changePhoneNo } from "./utils/phone.util";
import { ClassRate } from "../class-rate/entity/class-rate.entity";
import { AppDataSource } from "src/config/db.config";

export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  async addStudent(req: Request, res: Response) {
    try {
      const body = req.body as StudentObj;

      // ✅ Validation
      if (!body.name || !body.phone || !body.address || !body.section || !body.class_id) {
        return res.status(http_status.BadRequest).json({
          status: false,
          message: "Missing required fields: name, phone, address, section, or class_id",
        });
      }

      body.phone = changePhoneNo(body.phone);

      // ✅ Find ClassRate entity
      const classRate = await AppDataSource.getRepository(ClassRate).findOne({
        where: { class_id: body.class_id },
      });

      if (!classRate) {
        return res.status(http_status.BadRequest).json({
          status: false,
          message: `ClassRate with id ${body.class_id} not found`,
        });
      }

      // ✅ Prepare data for service
      const studentData = {
        name: body.name,
        phone: body.phone,
        address: body.address,
        section: body.section,
        status: body.status || "active",
        class_rate: classRate, // TypeORM relation
      };

      const data = await this.studentService.addStudent(studentData);

      return res.status(http_status.Success).json({
        status: true,
        message: "Student created successfully",
        data,
      });
    } catch (error) {
      console.error("❌ Error creating student:", error);
      return res.status(http_status.InternalServerError).json({
        status: false,
        message: "Something went wrong",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
