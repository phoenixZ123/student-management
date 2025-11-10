import { Student } from "src/features/student/entity/student.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from "typeorm";

@Entity("report_card")
export class ReportCard {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Student, (student) => student.reportCards, {
    onDelete: "CASCADE",
  })

  @ManyToOne(() => Student, (student) => student.reportCards, {
    onDelete: "CASCADE",   // if student is deleted, report cards will be deleted
    nullable: false,       // report card must have a student
  })
  @JoinColumn({ name: "student_id" }) // foreign key column
  student!: Student;

  @Column({ type: "varchar", length: 20 })
  month!: string;

  @Column({ type: "int" })
  year!: number;

  // --- Subject Grades as numbers ---
  @Column({ type: "int", nullable: true })
  myanmar?: number;

  @Column({ type: "int", nullable: true })
  english?: number;

  @Column({ type: "int", nullable: true })
  mathematics?: number;

  @Column({ type: "int", nullable: true })
  chemistry?: number;

  @Column({ type: "int", nullable: true })
  physics?: number;

  @Column({ type: "int", nullable: true })
  bio?: number;

  @Column({ type: "int", nullable: true })
  eco?: number;

  @Column({ type: "int", default: 0 })
  total?: number;


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
