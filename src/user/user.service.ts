import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PasswordHelper } from 'src/common/password.helper';
import { JwtService } from 'src/utils/jwt.service';
import { ConfigService } from '@nestjs/config';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordHelper: PasswordHelper,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'name', 'email', 'password', 'verificationToken'],
    });

    if (
      !user ||
      !(await this.passwordHelper.validatePassword(
        loginDto.password,
        user.password,
      ))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.generateToken({
      id: user.id,
      name: user.name,
    });

    return token;
  }

  async signup(signupDto: SignupDto): Promise<string> {
    const existingUser = await this.userRepository.findOneBy({
      email: signupDto.email,
    });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    const user = this.userRepository.create(signupDto);
    await this.userRepository.save(user);
    const token = this.jwtService.generateToken({
      id: user.id,
      name: user.name,
    });

    return token;
  }
}
