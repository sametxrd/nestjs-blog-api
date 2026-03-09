import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';
import { BlogResponse } from 'src/_common/response/blog.response';

export class UpdateBlogRes {
  @ApiProperty()
  blog: BlogResponse;
}

export class UpdateBlogResDTO extends BaseResponse<UpdateBlogRes> {
  @ApiProperty()
  declare data: UpdateBlogRes;
}
