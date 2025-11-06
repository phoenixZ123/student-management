import { loginUser } from "../dtos/user.dto";

export interface IAuthInterface{
  loginUser(loginUser: loginUser, userAgent?: string,
      userIp?: string): Promise<any>;  
}