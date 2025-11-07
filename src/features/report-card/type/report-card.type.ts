export type ReportCardData={
    month?:string;
    year?:number;
    date:string;
    myanmar:number;
    english:number;
    math:number;
    chemistry:number;
    physics:number;
    bio?:number;
    eco?:number;
    total?:number;
    student_id:string;
}
export type updateReportData={
    month?:string;
    year?:number;
    myanmar?:number;
    english?:number;
    mathematics?:number;
    chemistry?:number;
    physics?:number;
    bio?:number;
    eco?:number;
    total?:number;
    student_id:number;
}