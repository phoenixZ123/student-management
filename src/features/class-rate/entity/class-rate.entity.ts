import { Student } from "src/features/student/entity/student.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

@Entity("class_rate")
export class ClassRate {
  @PrimaryGeneratedColumn()
  class_id!: number;

  @Column("varchar", { length: 100 })
  className!: string;

  @Column("float", { default: 0 })
  classRate!: number;

  @OneToMany(() => Student, (student) => student.class_rate)
  students?: Student[];

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
