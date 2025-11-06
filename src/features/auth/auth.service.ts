import { AppDataSource } from "src/config/db.config";
import { User } from "./entity/user.entity";
import { Repository } from "typeorm";
import { UserSession } from "./entity/session.entity";
import { IAuthInterface } from "./interface/auth.interface";
import { loginUser, SessionType } from "./dtos/user.dto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { uuid } from "uuidv4";
import { Injectable } from "@nestjs/common";
@Injectable()
export class AuthService implements IAuthInterface {
  private userRepository: Repository<User>;
  private sessionRepository: Repository<UserSession>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.sessionRepository = AppDataSource.getRepository(UserSession);
  }
  async loginUser(loginUser: loginUser, userAgent?: string,
    userIp?: string): Promise<any> {
    try {
      // Check if user exists
      const exist = await this.userRepository.findOneBy({ email: loginUser.email });
      const uuidv4 = uuid();
      let newSession: SessionType | null;

      if (exist) {
        // const session = await this.getSession(exist.id);
        if (exist) {
          newSession = await this.updateSession(uuidv4, exist.id, userAgent, userIp);

        }
        const isPasswordMatch = await bcrypt.compare(loginUser.password, exist.password);
        if (!isPasswordMatch) {
          return { status: false, message: "Invalid password" };
        }
        await AppDataSource.getRepository(User).update({ email: loginUser.email }, { is_active: true })
        return {  data:exist, token: this.generateToken(exist) };
      }
      // Create new user
      const hashedPassword = await bcrypt.hash(loginUser.password, 10);
      loginUser.password = hashedPassword;
      const user = this.userRepository.create({ email: loginUser.email, password: hashedPassword, is_active: true });
      const userCreated = await this.userRepository.save(user);
      newSession = await this.createSession(uuidv4, userCreated.id, userAgent, userIp);

      return { data:userCreated, token: this.generateToken(userCreated) };
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed");
    }

  }
  private generateToken(user: User) {
    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    return { access_token: token };
  }
  async createSession(
    session: string,
    userId: number,
    userAgent?: string,
    userIp?: string
  ): Promise<UserSession> {
    const userSessionRepo = AppDataSource.getRepository(UserSession);

    const newSession = userSessionRepo.create({
      user: { id: Number(userId) },
      token: session,
      user_agent: userAgent ?? "unknown",
      ip_address: userIp,
      created_at: new Date(),
    });

    return await userSessionRepo.save(newSession);
  }


  async updateSession(
    session: string,
    userId: number,
    userAgent?: string,
    userIp?: string
  ): Promise<UserSession | null> {
    const uSess = AppDataSource.getRepository(UserSession);

    // Perform the update
    await uSess.update(
      { user: { id: Number(userId) } }, // WHERE condition
      {
        token: session,
        user_agent: userAgent ?? "unknown",
        ip_address: userIp ?? "unknown",
        created_at: new Date(),
      }
    );

    // Return the updated session
    const updatedSession = await uSess.findOne({
      where: { user: { id: Number(userId) } },
      select: {
        id: true,
        user: true,
        token: true,
        user_agent: true,
        ip_address: true,
        created_at: true,
      },
    });

    return updatedSession;
  }


  async getSession(userId: number): Promise<any> {
    const session = AppDataSource.getRepository(UserSession);
    return session.findOne({
      where: { user: { id: userId } },
      order: { created_at: "desc" },
    });
  }

}