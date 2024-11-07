import {IsNotEmpty, IsString, IsStrongPassword, MinLength} from "class-validator";


export class RegisterDto {

	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	login: string;

	@IsStrongPassword()
	password: string;

}
