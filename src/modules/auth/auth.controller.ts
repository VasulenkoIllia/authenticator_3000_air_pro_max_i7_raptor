import {Body, Controller, Get, Post, Req, UseGuards} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {LoginDto} from "../../common/dto/auth/login.dto";
import {RegisterDto} from "../../common/dto/auth/register.dto";
import {IAuthResponse} from "../../common/interfaces/auth/auth.response.interface";
import {JwtGuard} from "./guards/jwt.guard";
import {IAuthorizedRequest} from "../../common/interfaces/auth/authorized-request.interface";
import {IJwt} from "../../common/interfaces/auth/jwt.interface";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	@Post("login")
	signIn(@Body() signInDto: LoginDto): Promise<IAuthResponse> {
		return this.authService.signIn(signInDto.login, signInDto.password);
	}

	@Post("register")
	register(@Body() signUpDto: RegisterDto): Promise<IAuthResponse> {
		return this.authService.register(signUpDto);
	}

	@UseGuards(JwtGuard)
	@Get('profile')
	async getProfile(@Req()  request: IAuthorizedRequest): Promise<IJwt> {
		return request.user;
	}

}
