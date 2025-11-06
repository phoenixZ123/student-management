import { Repository } from "typeorm";
import { ReportCard } from "./entity/report-card.entity";
import { AppDataSource } from "src/config/db.config";

export class ReportCardService{
    private reportCardRepository:Repository<ReportCard>;

    constructor(){
        this.reportCardRepository=AppDataSource.getRepository(ReportCard);
    }
}