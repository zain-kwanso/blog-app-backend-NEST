import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationQueryDto } from 'src/common/pagination.dto';
import { Post as PostModel } from './post.entity';
import { Public } from 'src/common/public.decorator';
import { LoggedInUserId } from 'src/common/loggedinUserId.decorator';
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @LoggedInUserId() userId: number,
  ) {
    console.log(userId);
    return this.postService.create(createPostDto, userId);
  }

  @Public()
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    const { page, limit, search } = paginationQuery;
    return this.postService.getPosts(Number(page), Number(limit), search);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PostModel> {
    return await this.postService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @LoggedInUserId() userId: number,
  ) {
    return this.postService.update(+id, updatePostDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @LoggedInUserId() userId: number) {
    return this.postService.remove(+id, userId);
  }
}
