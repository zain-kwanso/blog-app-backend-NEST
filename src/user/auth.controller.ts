import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/common/public.decorator';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: UserService) {}

  @Public()
  @Post('signin')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    const token = await this.authService.login(loginDto);
    return { token };
  }

  @Public()
  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<{ token: string }> {
    const token = await this.authService.signup(signupDto);
    return { token };
  }

  @Get('me')
  async checkAuth(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req['user'];
      if (user) {
        return res.status(200).json({ user });
      }
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }
}
