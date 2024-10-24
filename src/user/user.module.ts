import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from 'src/utils/jwt.module';
import { AuthController } from './auth.controller';
import { PasswordHelper } from 'src/common/password.helper';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  controllers: [UserController, AuthController],
  providers: [UserService, PasswordHelper],
})
export class UserModule {}
