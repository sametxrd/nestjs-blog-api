import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Blog } from './blog.entity';
import { BaseEntity } from 'src/_base/entity/base.entity';

@Entity()
export class Comment extends BaseEntity {
  @Column({ type: 'varchar', length: 300 })
  content: string;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Blog, (blog) => blog.comments, {
    onDelete: 'CASCADE',
  })
  blog: Blog;
}
