import { Student } from "src/features/student/entity/student.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
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

  // --- Subject Grades ---
  @Column("varchar", { length: 2, nullable: true })
  myanmar?: string;

  @Column("varchar", { length: 2, nullable: true })
  english?: string;

  @Column("varchar", { length: 2, nullable: true })
  mathematics?: string;

  @Column("varchar", { length: 2, nullable: true })
  chemistry?: string;

  @Column("varchar", { length: 2, nullable: true })
  physics?: string;

  @Column("varchar", { length: 2, nullable: true })
  bio?: string;

  @Column("varchar", { length: 2, nullable: true })
  eco?: string;

  @Column("int",{default:0})
  total?:number;

  @Column({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at!: Date;

  @Column({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;
}
