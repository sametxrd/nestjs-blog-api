import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BlogStatus } from '../enum/blog.enum';
import { User } from './user.entity';
import { BlogPhoto } from './blog.photo.entity';
import { Comment } from './comment.entity';
import { BaseEntity } from 'src/_base/entity/base.entity';

@Entity()
export class Blog extends BaseEntity {
  @Column({ type: 'varchar', length: 130 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: BlogStatus, default: BlogStatus.PASSIVE })
  blog_status: BlogStatus;

  @Column({ type: 'tinyint', default: 0 })
  is_home: boolean;

  @ManyToOne(() => User, (user) => user.blogs, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => BlogPhoto, (blogPhoto) => blogPhoto.blog, {
    cascade: true,
  })
  blog_photos: BlogPhoto[];

  @OneToMany(() => Comment, (comment) => comment.blog, {
    cascade: true,
  })
  comments: Comment[];
}
