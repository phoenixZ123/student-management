import { classRateService } from "./class-rate.service";

export class classRateController{
    private classRateService:classRateService;
    constructor(){
        this.classRateService=new classRateService();
    }
}