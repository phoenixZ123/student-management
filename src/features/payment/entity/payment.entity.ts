import { Student } from "src/features/student/entity/student.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
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

  @Column("varchar", { length: 155, nullable: true })
  note?: string;  // lowercase and varchar is fine

  @Column("float", { default: null })
  credit_amount!: number; // use float or numeric, NOT "number"

  @Column("varchar", { length: 50, default: "cash" })
  payment_type!: string;

  @Column({
    type: "timestamptz",
    nullable: true,   // allows null values
    default: null
  })
  payment_date?: Date;

  @Column({
    type: 'timestamptz', 
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
