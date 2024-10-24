import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'Comments' })
export class Comment extends BaseEntity {
  @Field(() => Int)
  @Column({ type: 'int', nullable: false })
  UserId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments, { nullable: false })
  @JoinColumn({ name: 'UserId' })
  user: User;

  @Field(() => Int)
  @Column({ type: 'int', nullable: false })
  PostId: number;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'PostId' })
  post: Post;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  ParentId: number;

  @Field(() => Comment, { nullable: true })
  @ManyToOne(() => Comment, (comment) => comment.replies, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'ParentId' })
  parentComment: Comment;

  @Field()
  @Column({ type: 'varchar', length: 100, nullable: false })
  content: string;

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies: Comment[];
}
