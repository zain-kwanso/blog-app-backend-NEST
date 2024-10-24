// jwt.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from './jwt.service';

@Module({
  imports: [ConfigModule],
  providers: [JwtService, ConfigService],
  exports: [JwtService],
})
export class JwtModule {}
