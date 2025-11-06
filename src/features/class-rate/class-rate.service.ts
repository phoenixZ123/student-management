import { Repository } from "typeorm";
import { ClassRate } from "./entity/class-rate.entity";
import { AppDataSource } from "src/config/db.config";
import { error } from "console";
import { Injectable } from "@nestjs/common";
@Injectable()
export class ClassRateService {
    private classRateRepository: Repository<ClassRate>;

    constructor() {
        this.classRateRepository = AppDataSource.getRepository(ClassRate);
    }

    // ✅ Create new class
    async create(data: Partial<ClassRate>): Promise<ClassRate> {
        const newClass = this.classRateRepository.create(data);
        return await this.classRateRepository.save(newClass);
    }
    // ✅ Get all classes
    async findAll(): Promise<ClassRate[]> {
        const classes = await this.classRateRepository
            .createQueryBuilder("classRate")
            .leftJoinAndSelect("classRate.students", "student")
            .getMany();

        return classes;
    }
    // ✅ Get one class by ID
    async findOne(id: number): Promise<ClassRate> {
        const classRate = await this.classRateRepository.findOne({
            where: { class_id: id },
            relations: ["students"],
        });
        if (!classRate) throw new error("Class not found");
        return classRate;
    }
    // ✅ Update class by ID
    async update(id: number, data: Partial<ClassRate>): Promise<ClassRate> {
        // Find the existing classRate
        const classRate = await this.classRateRepository.findOne({ where: { class_id: id } });
        if (!classRate) {
            throw new Error('ClassRate not found');
        }

        // Merge the new data into the existing entity
        Object.assign(classRate, data);

        // Save the updated entity
        return await this.classRateRepository.save(classRate);
    }
    // ✅ Delete class by ID
    async remove(id: number): Promise<any> {
        const result = await this.classRateRepository.delete(id);
        if (result.affected === 0) {
            throw new error("Class not found");
        }  
        if(result){
            return true;
        }else{
            return false;
        }     
    }
}
