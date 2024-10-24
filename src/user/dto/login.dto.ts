import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Password must be at least 5 characters long' })
  readonly password: string;
}
