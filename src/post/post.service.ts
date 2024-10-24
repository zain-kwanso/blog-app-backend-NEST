import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Like, Repository } from 'typeorm';
import paginationConfig from 'src/utils/pagination.config';
import { Public } from 'src/common/public.decorator';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, UserId: number): Promise<Post> {
    try {
      const post = this.postRepository.create({
        ...createPostDto,
        UserId,
      });

      return await this.postRepository.save(post);
    } catch (error) {
      throw new ConflictException('Failed to create post');
    }
  }

  async getPosts(
    page: number = paginationConfig.defaultPage,
    limit: number = paginationConfig.defaultLimit,
    search?: string,
    userId?: number,
  ) {
    const offset = (page - 1) * limit;
    const userCondition = userId ? { UserId: userId } : {};
    const searchCondition = search
      ? [
          { title: Like(`%${search}%`), ...userCondition },
          { content: Like(`%${search}%`), ...userCondition },
        ]
      : { ...userCondition };
    const [posts, count] = await this.postRepository.findAndCount({
      where: searchCondition,
      relations: ['user'],
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        UserId: true,
        user: {
          name: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      skip: offset,
      take: limit,
    });

    const modifiedPosts = posts.map((post) => ({
      ...post,
      authorName: post.user.name,
      user: undefined,
    }));

    const totalPages: number = Math.ceil(count / limit);
    const pagination = {
      currentPage: page,
      totalPages: totalPages,
    };
    return {
      posts: modifiedPosts,
      pagination,
    };
  }

  @Public()
  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<string> {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.UserId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this post',
      );
    }

    Object.assign(post, updatePostDto);

    await this.postRepository.save(post);

    return 'Post updated successfully';
  }

  async remove(id: number, userId: number): Promise<string> {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.UserId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this post',
      );
    }

    await this.postRepository.remove(post);
    return 'Post deleted successfully';
  }
}
