import { IsString, IsOptional, IsNotEmpty, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @Length(1, 255, {
    message: 'Title must be between 1 and 255 characters long',
  })
  readonly title?: string;

  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  @Length(10, 3000, {
    message: 'Content must be between 10 and 3000 characters long',
  })
  readonly content?: string;
}
