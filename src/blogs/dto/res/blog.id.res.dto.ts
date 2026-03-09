import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';
import { BlogResponse } from 'src/_common/response/blog.response';

export class BlogIdRes {
  @ApiProperty()
  blog: BlogResponse;
}

export class BlogIdResDTO extends BaseResponse<BlogIdRes> {
  @ApiProperty()
  declare data: BlogIdRes;
}
