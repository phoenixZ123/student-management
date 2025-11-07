import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { ClassRate } from "src/features/class-rate/entity/class-rate.entity";
import { Payment } from "src/features/payment/entity/payment.entity";
import { ReportCard } from "src/features/report-card/entity/report-card.entity";

@Entity("student")
export class Student {
    @PrimaryGeneratedColumn()
    student_id!: number;

    @Column("varchar", { length: 100 })
    name!: string;

    @ManyToOne(() => ClassRate, (classRate) => classRate.students, {
        onDelete: "SET NULL",
        nullable: true,
    })
    class_rate!: ClassRate | null;

    @Column("varchar", { length: 15 })
    phone!: string;

    @Column("varchar", { length: 255 })
    address!: string;

    @Column("varchar", { length: 50 })
    section!: string;

    @Column("varchar", { length: 20, default: "active" })
    status!: string;

    @OneToMany(() => Payment, (payment) => payment.student)
    payments?: Payment[];

    @OneToMany(() => ReportCard, (reportCard) => reportCard.student)
    reportCards?: ReportCard[];

    @Column({
        type: 'timestamptz',            // store timezone-aware timestamp
        default: () => 'CURRENT_TIMESTAMP'
    })
    created_at!: Date;

    @Column({
        type: 'timestamptz',            // store timezone-aware timestamp
        default: () => 'CURRENT_TIMESTAMP'
    })
    updated_at!: Date;
}
