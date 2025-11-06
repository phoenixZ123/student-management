import { Controller, Post, Body, Res, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { ClassRateService } from "./class-rate.service";
import { ClassRate } from "./entity/class-rate.entity";
import { http_status } from "src/shared/constants/http_status";

@Controller("class-rate")
export class ClassRateController {
    constructor(private readonly classRateService: ClassRateService) { }

    /**
     * Create a new class rate
     * @param body - Class rate details
     * @param res - HTTP response object
     */
    async createClassRate(req: Request, res: Response) {
  try {
    const body = req.body as Partial<ClassRate>;

    if (!body.className || body.classRate == null) {
      return res.status(http_status.BadRequest).json({
        status: false,
        message: 'Some fields are required!'
      });
    }

    const classData = await this.classRateService.create(body);

    return res.status(http_status.Success).json({
      status: true,
      message: 'Class rate created successfully',
      data: classData
    });
  } catch (error: any) {
    console.error('Error creating class rate:', error);
    return res.status(http_status.InternalServerError).json({
      status: false,
      message: 'Failed to create class rate',
      error: error.message
    });
  }
}

}
