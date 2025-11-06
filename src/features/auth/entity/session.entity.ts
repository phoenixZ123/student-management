import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from "typeorm";
import { User } from "./user.entity";

@Entity("user-session")
export class UserSession {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    token!: string;


    @Column({ type: String, nullable: true })
    ip_address!: string;

    @Column({ type: 'varchar', nullable:true })
    user_agent!: string;


    @ManyToOne(() => User, (user) => user.sessions, { onDelete: "CASCADE" })
    user!: User;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at!: Date;
}
