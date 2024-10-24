import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@ObjectType()
@Entity({ name: 'Posts' })
export class Post extends BaseEntity {
  @Column({ type: 'int', nullable: false })
  UserId: number;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'UserId' })
  user: User;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
