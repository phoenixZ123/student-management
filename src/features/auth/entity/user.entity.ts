import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { UserSession } from "./session.entity";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "uuid", nullable: true })
  uuid: string = uuidv4();

  @Column({ type: "varchar", unique: true })
  email!: string;

  // @Column({ type: "varchar", unique: true })
  // phone_no!: string;

  @Column({ type: "varchar" })
  password!: string;

  @Column({ type: "boolean", default: false })
  is_active!: boolean;

  @OneToMany(() => UserSession, (session) => session.user)
  sessions?: UserSession[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
