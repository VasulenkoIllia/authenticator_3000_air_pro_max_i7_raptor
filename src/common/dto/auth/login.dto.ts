import {IsNotEmpty, IsString, IsStrongPassword, MinLength} from "class-validator";


export class LoginDto {

	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	login: string;
	
	@IsStrongPassword()
	password: string;

}
