import { Column, Entity, ManyToOne } from 'typeorm';
import { Blog } from './blog.entity';
import { BaseEntity } from 'src/_base/entity/base.entity';

@Entity()
export class BlogPhoto extends BaseEntity {
  @Column({ type: 'varchar' })
  blog_photo_url: string;

  @ManyToOne(() => Blog, (blog) => blog.blog_photos, {
    onDelete: 'CASCADE',
  })
  blog: Blog;
}
