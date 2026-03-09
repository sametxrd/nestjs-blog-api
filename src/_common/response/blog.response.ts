import { ApiProperty } from '@nestjs/swagger';
import { BlogStatus } from '../enum/blog.enum';

export class BlogResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  blog_status: BlogStatus;
  @ApiProperty()
  is_home: boolean;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt: Date;
}
