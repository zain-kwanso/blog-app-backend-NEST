import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './dto/comment';
import { Public } from 'src/common/public.decorator';
import { LoggedInUserId } from 'src/common/loggedinUserId.decorator';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @LoggedInUserId() userId: number,
  ): Promise<Comment> {
    return await this.commentService.create(createCommentDto, userId);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Public()
  @Get('/post/:id')
  async findCommentsOnPost(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Comment[]> {
    return await this.commentService.findAllByPostId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @LoggedInUserId() userId: number,
  ): Promise<{ message: string }> {
    return { message: await this.commentService.remove(id, userId) };
  }
}
