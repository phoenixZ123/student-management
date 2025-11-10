import { Student } from "src/features/student/entity/student.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("payment")
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Student, (student) => student.payments, {
    onDelete: "CASCADE",
  })
  student?: Student;

  @Column("float", { default: 0 })
  amount!: number;

  @Column("varchar", { length: 50, default: "cash" })
  payment_type!: string;

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
