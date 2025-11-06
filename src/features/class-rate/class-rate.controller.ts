import { Controller, Post, Body, Res, HttpStatus, Query } from "@nestjs/common";
import { Response } from "express";
import { ClassRateService } from "./class-rate.service";
import { ClassRate } from "./entity/class-rate.entity";
import { http_status } from "src/shared/constants/http_status";
import { error } from "console";

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
    /**
    * Create a new class rate
    * @param body - Class rate details
    * @param res - HTTP response object
    */
    async all_class(req: Request, res: Response) {
        try {
            const all = await this.classRateService.findAll();
            console.log("all class:", all);
            return res.status(http_status.Success).json({
                status: true,
                message: "All Class List",
                data: all
            })
        } catch (error: any) {
            console.error('Error retrieve class rate:', error);
            return res.status(http_status.InternalServerError).json({
                status: false,
                message: 'Failed to retrieve class rate',
                error: error.message
            });
        }
    }
    async updateClass(req: any, res: Response) {
        try {
            // Access 'cid' from query and convert to number
            const { id } = req.query as { id?: string };
            if (!id) {
                return res.status(http_status.BadRequest).json({
                    status: false,
                    message: "Class id (cid) is required in query",
                });
            }

            const classId = Number(id);
            if (isNaN(classId)) {
                return res.status(http_status.BadRequest).json({
                    status: false,
                    message: "Class id (cid) must be a number",
                });
            }

            // Access request body
            const body = req.body as Partial<ClassRate>;
            // if (!body.className || !body.classRate) {
            //     return res.status(http_status.BadRequest).json({
            //         status: false,
            //         message: "Some fields are required.",
            //     });
            // }

            // Call service to update
            const updated = await this.classRateService.update(classId, body);

            return res.status(http_status.Success).json({
                status: true,
                message: "Class Rate Updated Successfully",
                updated,
            });
        } catch (error) {
            console.error(error);
            return res.status(http_status.InternalServerError).json({
                status: false,
                message: "Something went wrong",
                error: error instanceof Error ? error.message : error,
            });
        }
    }
}
