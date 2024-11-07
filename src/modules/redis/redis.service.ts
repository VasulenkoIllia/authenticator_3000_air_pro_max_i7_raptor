import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from "ioredis";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class RedisService implements OnModuleInit {
	private redis: Redis;

	constructor(
			private configService: ConfigService
	) {}

	async onModuleInit() {
		const url = this.configService.get<string>('REDIS_URL')
		this.redis = new Redis(url)
	}

	instance() {
		return this.redis;
	}

}
