import { Column, Entity, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/post/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { BaseEntity } from 'src/common/base.entity';

@ObjectType()
@Entity({ name: 'Users' })
export class User extends BaseEntity {
  @Field()
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Field()
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false, select: false })
  password: string;

  @Field()
  @Column({ default: false })
  isAdmin: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  verificationToken: string;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  verificationTime: Date;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 1000, nullable: true })
  profileKey: string;

  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
