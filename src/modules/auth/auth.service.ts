import {ForbiddenException, Injectable, UnauthorizedException} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {PrismaService} from "../prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import {User} from "@prisma/client";
import {IAuthResponse} from "../../common/interfaces/auth/auth.response.interface";
import {RegisterDto} from "../../common/dto/auth/register.dto";
import {IJwt} from "../../common/interfaces/auth/jwt.interface";
import {RedisService} from "../redis/redis.service";

@Injectable()
export class AuthService {
  constructor(
      private prisma: PrismaService,
      private readonly jwtService: JwtService,
  ) {}

  async signIn(login: string, password: string): Promise<IAuthResponse> {
    const user = await this.findUserByLogin(login);
    if (!user) {
      throw new UnauthorizedException();
    }
    const confirmPass = await bcrypt.compare(password, user.password);
    if (!confirmPass) {
      throw new UnauthorizedException();
    }

    return { accessToken: await this.signUser(user) };
  }

  async register(dto: RegisterDto): Promise<IAuthResponse> {
    const existedUser = await this.findUserByLogin(dto.login);

    const user: User =  await this.prisma.user.create({
      data: {
        login: dto.login,
        password: await bcrypt.hash(dto.password, 10),
      }
    })
    return { accessToken: await this.signUser(user) };
  }


  private async findUserByLogin(login: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {login}
    });
  }

  private async signUser(user: User) {
    const payload: IJwt = {
      id: user.id,
      login: user.login,
    };
    return await this.jwtService.signAsync(payload)
  }


}
