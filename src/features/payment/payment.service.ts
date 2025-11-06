import { Repository } from "typeorm";
import { Payment } from "./entity/payment.entity";
import { AppDataSource } from "src/config/db.config";
import { IPaymentInterface } from "./interface/payment.interface";

export class paymentService implements IPaymentInterface{
    private paymentRepository:Repository<Payment>;
    constructor(){
        this.paymentRepository=AppDataSource.getRepository(Payment);
    }
}