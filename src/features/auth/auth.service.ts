import { AppDataSource } from "src/config/db.config";
import { User } from "./entity/user.entity";
import { UserSession } from "./entity/session.entity";
import { Repository } from "typeorm";
import { loginUser } from "./dtos/user.dto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { Injectable } from "@nestjs/common";
import { AppConfig } from "src/config/app.config";

@Injectable()
export class AuthService {
  private userRepository: Repository<User>;
  private sessionRepository: Repository<UserSession>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.sessionRepository = AppDataSource.getRepository(UserSession);
  }

  async loginUser(loginUser: loginUser, userAgent?: string, userIp?: string) {
    // 1️⃣ Find existing user
    let user = await this.userRepository.findOneBy({ email: loginUser.email });

    // 2️⃣ If user exists, verify password
    if (user) {
      const isPasswordMatch = await bcrypt.compare(loginUser.password, user.password);
      if (!isPasswordMatch) {
        throw new Error("Invalid password");
      }
      // Update active status
      await this.userRepository.update({ id: user.id }, { is_active: true });

      // Update session
      await this.updateSession(uuidv4(), user.id, userAgent, userIp);

    } else {
      // 3️⃣ Create new user if not exists
      const hashedPassword = await bcrypt.hash(loginUser.password, 10);
      const newUser = this.userRepository.create({
        email: loginUser.email,
        password: hashedPassword,
        is_active: true,
      });
      user = await this.userRepository.save(newUser);

      // Create session
      await this.createSession(uuidv4(), user.id, userAgent, userIp);
    }

    // 4️⃣ Generate token
    const token = this.generateToken(user);

    // 5️⃣ Prepare response without password
    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      token,
    };
  }

  private generateToken(user: User) {
    const secret = AppConfig.secrets.jwtSecret || "your_jwt_secret";
    return jwt.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn: "1d" }
    );
  }

  async createSession(session: string, userId: number, userAgent?: string, userIp?: string) {
    const newSession = this.sessionRepository.create({
      user: { id: userId },
      token: session,
      user_agent: userAgent ?? "unknown",
      ip_address: userIp,
      created_at: new Date(),
    });

    return await this.sessionRepository.save(newSession);
  }

  async updateSession(session: string, userId: number, userAgent?: string, userIp?: string) {
    await this.sessionRepository.update(
      { user: { id: userId } },
      {
        token: session,
        user_agent: userAgent ?? "unknown",
        ip_address: userIp ?? "unknown",
        created_at: new Date(),
      }
    );

    return await this.sessionRepository.findOne({
      where: { user: { id: userId } },
    });
  }
}
