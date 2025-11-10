import { Request, Response } from "express";
import { ReportCardService } from "./report-card.service";
import { ReportCardData, updateReportData } from "./type/report-card.type";
import { http_status } from "src/shared/constants/http_status";

export class ReportCardController {
    constructor(private readonly reportCardService: ReportCardService) { }

    async createReportCard(req: Request, res: Response) {
        try {
            const data = req.body as ReportCardData;

            // ✅ Extract month and year from frontend date
            if (!data.date) {
                return res.status(http_status.BadRequest).json({
                    status: false,
                    message: "Missing date field",
                });
            }

            const date = new Date(data.date);
            const month = date.toLocaleString("en-US", { month: "long" }); // e.g. "November"
            const year = date.getFullYear(); // e.g. 2025

            // ✅ Assign derived fields before validation
            data.month = month;
            data.year = year;

            // ✅ Validate required fields
            const requiredFields = [
                "month",
                "year",
                "myanmar",
                "english",
                "math",
                "chemistry",
                "physics",
                "student_id",
            ];

            for (const field of requiredFields) {
                if (data[field as keyof ReportCardData] === undefined) {
                    return res.status(http_status.BadRequest).json({
                        status: false,
                        message: `Missing required field: ${field}`,
                    });
                }
            }

            // ✅ Call the service to create the record

            const reportCard = await this.reportCardService.createReportCard(data);

            return res.status(http_status.Success).json({
                status: true,
                message: "Report card created successfully",
                data: reportCard,
            });
        } catch (error) {
            console.error("Error creating report card:", error);
            return res.status(http_status.InternalServerError).json({
                status: false,
                message: "Something went wrong",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }

    async getStudentReport(req: Request, res: Response) {
        try {
            const { id } = req.query as { id?: string };

            const data = await this.reportCardService.getReportCard(Number(id));
            // console.log("report ",data);
            if (data) {
                return res.status(http_status.Success).json({
                    status: true,
                    message: "Student Report Card",
                    data
                })
            }
        } catch (error) {
            console.error("Error get report card:", error);
            return res.status(http_status.InternalServerError).json({
                status: false,
                message: "Something went wrong",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async deleteReportCard(req: Request, res: Response) {
        try {
            const { id } = req.query as { id?: string };

            const data = await this.reportCardService.deleteReportCard(Number(id));
            if (data) {
                return res.status(http_status.Success).json({
                    status: true,
                    message: "Report Card Deletion Successfully",
                })
            }
        } catch (error) {
            console.error("Error delete report card:", error);
            return res.status(http_status.InternalServerError).json({
                status: false,
                message: "Something went wrong",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async updateReportCard(req: Request, res: Response) {
        try {
            const { id } = req.query as { id?: string };
            const body = req.body as updateReportData;

            if (!body.date) {
                throw new Error("Date is required to determine month and year");
            }

            const date = new Date(body.date);
            if (isNaN(date.getTime())) {
                throw new Error("Invalid date format");
            }

            const month = date.toLocaleString("en-US", { month: "long" });
            const year = date.getFullYear();

            body.month = month;
            body.year = year;

            const data = await this.reportCardService.updateReportCard(Number(id), body);

            if (!data) {
                throw new Error("Cannot Update This Report Card");
            }

            return res.status(http_status.Success).json({
                status: true,
                message: "Report Card Updated Successfully",
                data,
            });
        } catch (error) {
            console.error("Error update report card:", error);
            return res.status(http_status.InternalServerError).json({
                status: false,
                message: "Something went wrong",
                error: error instanceof Error ? error.message : String(error),
            });
        }

    }
}
