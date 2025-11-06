import { Repository } from "typeorm";
import { ClassRate } from "./entity/class-rate.entity";
import { AppDataSource } from "src/config/db.config";

export class classRateService{
    private classRateRepository:Repository<ClassRate>;

    constructor(){
        this.classRateRepository=AppDataSource.getRepository(ClassRate);
    }
}