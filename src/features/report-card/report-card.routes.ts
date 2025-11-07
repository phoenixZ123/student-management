import { Router } from "express";
import { ReportCardService } from "./report-card.service";
import { ReportCardController } from "./report-card.controller";
import { authenticate } from "../auth/middlewares/auth.middleware";

const router=Router();
const repService = new ReportCardService();
const reportController = new ReportCardController(repService);

router.post("/create-report-card",authenticate,reportController.createReportCard.bind(reportController));
router.get("/get-report-card",reportController.getStudentReport.bind(reportController));
router.delete("/delete-report-card",authenticate,reportController.deleteReportCard.bind(reportController));
router.put("/update-report-card",authenticate,reportController.updateReportCard.bind(reportController));
export default router;