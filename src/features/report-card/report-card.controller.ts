import { ReportCardService } from "./report-card.service";

export class ReportCardController{
    private reportCardService:ReportCardService;

    constructor(){
        this.reportCardService=new ReportCardService();
    }
}