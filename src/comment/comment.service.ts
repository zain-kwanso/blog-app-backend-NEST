import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    UserId: number,
  ): Promise<Comment> {
    if (createCommentDto.ParentId) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: createCommentDto.ParentId },
      });
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
      if (parentComment.PostId !== createCommentDto.PostId) {
        throw new ForbiddenException('Comment is not on the specified post');
      }
    }
    const comment = this.commentRepository.create({
      ...createCommentDto,
      UserId,
    });
    await this.commentRepository.save(comment);
    return comment;
  }

  findAll() {
    return `This action returns all comment`;
  }

  async findAllByPostId(postId: number): Promise<Comment[]> {
    const comments = await this.commentRepository.find({
      where: {
        PostId: postId,
        ParentId: null,
      },
      relations: ['replies', 'replies.user', 'user'],
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        UserId: true,
        ParentId: true,
        user: {
          name: true,
        },
        replies: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          UserId: true,
          user: {
            name: true,
          },
        },
      },
    });
    let modifiedComments: Comment[] = [];
    comments.map((comment) => {
      if (comment.ParentId === null) {
        modifiedComments.push(comment);
      }
    });
    return modifiedComments;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  async remove(id: number, UserId: number): Promise<string> {
    const comment = await this.commentRepository.findOne({
      where: { id },
    });

    if (comment.UserId !== UserId) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }

    await this.commentRepository.remove(comment);
    return 'Comment deleted successfully';
  }
}
