import {CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException,} from "@nestjs/common";

import {Request} from "express";
import {JwtService} from "@nestjs/jwt";
import {RedisService} from "../../redis/redis.service";
import {AuthService} from "../auth.service";
import {IJwt} from "../../../common/interfaces/auth/jwt.interface";

@Injectable()
export class JwtGuard implements CanActivate {
	constructor(
			private jwtService: JwtService,
			private redisService: RedisService,
	) {
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			let token =
					(
							context.switchToHttp().getRequest() as Request
					).headers.authorization?.split(" ")[1] ||
					(
							context.switchToHttp().getRequest() as Request
					).body?.accessToken?.split(" ")[1];

			if (!token) {
				throw new UnauthorizedException();
			}
			const redis = this.redisService.instance()

			let tokenName = `token:${token}`
			let tokenCache;
			const logger = new Logger('AUTH')
			logger.log(`TOKEN: ${tokenName}`, );
			logger.log(`IN REDIS: ${(await redis.hexists(tokenName, 'login')) > 0 ? "YES" : "NO"}`);
			if (!await redis.hexists(tokenName, 'login')) {
				const decodedAccessToken = await this.jwtService.verifyAsync(
						token,
						{
							secret: process.env.ACCESS_TOKEN_SECRET,
						}
				);
				if (!decodedAccessToken) {
					throw new UnauthorizedException();
				}

				await redis.hset(tokenName, decodedAccessToken);
				tokenCache = decodedAccessToken;
			} else {
				tokenCache = await redis.hgetall(tokenName);
			}



			redis.expire(tokenName, 60)
			const request = context.switchToHttp().getRequest();
			request.user = tokenCache;

			return true;
		} catch (ex) {
			Logger.error(ex);
			throw new UnauthorizedException();
		}
	}
}
