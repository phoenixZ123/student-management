import { paymentService } from "./payment.service";

export class paymentController{
    private paymentService:paymentService;
    constructor(){
        this.paymentService=new paymentService();
    }
}