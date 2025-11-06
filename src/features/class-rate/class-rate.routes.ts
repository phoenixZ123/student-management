import { Router } from "express";
import { ClassRateController } from "./class-rate.controller";
import { ClassRateService } from "./class-rate.service";

const router=Router();
const classRateService = new ClassRateService();
const classController = new ClassRateController(classRateService);

router.post("/add-class",classController.createClassRate.bind(classController));
export default router;