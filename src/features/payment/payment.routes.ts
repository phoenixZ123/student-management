import { Router } from "express";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { authenticate } from "../auth/middlewares/auth.middleware";

const router=Router();
const paymentService = new PaymentService();
const paymentController = new PaymentController(paymentService);
router.post("/create-payment",authenticate,paymentController.create.bind(paymentController));
router.get("/get-payment",authenticate,paymentController.getPayment.bind(paymentController));
router.get("/get-student-details",authenticate,paymentController.getStudentPayment.bind(paymentController));
router.put("/update-payment",paymentController.updatePaymentC.bind(paymentController));
router.get("/delete-payment",paymentController.deletePaymentC.bind(paymentController));
export default router;