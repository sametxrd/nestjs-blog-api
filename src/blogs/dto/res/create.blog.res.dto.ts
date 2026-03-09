import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';
import { BlogResponse } from 'src/_common/response/blog.response';

export class CreateBlogRes {
  @ApiProperty()
  blog: BlogResponse;
}

export class CreateBlogResDTO extends BaseResponse<CreateBlogRes> {
  @ApiProperty()
  declare data: CreateBlogRes;
}
