import { Student } from "src/features/student/entity/student.entity";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("report_card")
export class ReportCard {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Student, (student) => student.reportCards, {
        onDelete: "CASCADE",
    })
    student?: Student;

    @Column("varchar", { length: 20 })
    month!: string;

    @Column("int")
    year!: number;

    @Column("int", { default: 0 })
    myanmar!: number;

    @Column("int", { default: 0 })
    english!: number;

    @Column("int", { default: 0 })
    mathematics!: number;

    @Column("int", { nullable: true, default: 0 })
    chemistry!: number;

    @Column("int", { nullable: true, default: 0 })
    physics!: number;

    @Column("int", { nullable: true, default: 0 })
    bio!: number;

    @Column("int", { nullable: true, default: 0 })
    eco!: number;

    @Column("int", { default: 0 })
    total!: number;

    @Column({
        type: 'timestamptz', // timezone-aware
        default: () => "CURRENT_TIMESTAMP"
    })
    created_at!: Date;

    @Column({
        type: 'timestamptz',
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP"
    })
    updated_at!: Date;
}
