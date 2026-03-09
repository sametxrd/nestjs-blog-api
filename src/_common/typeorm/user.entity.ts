import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { UserRole } from '../enum/user.enum';
import { Blog } from './blog.entity';
import { Comment } from './comment.entity';
import { BaseEntity } from 'src/_base/entity/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar' })
  avatarUrl: string;

  @Column({ type: 'varchar', length: 30 })
  display_username: string;

  @Column({ type: 'varchar', length: 20 })
  global_username: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  user_role: UserRole;

  @OneToMany(() => Blog, (blog) => blog.user, {
    cascade: true,
  })
  blogs: Blog[];

  @OneToMany(() => Comment, (comment) => comment.user, {
    cascade: true,
  })
  comments: Comment[];
}
