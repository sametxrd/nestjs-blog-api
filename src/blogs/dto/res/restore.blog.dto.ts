import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';
import { BlogResponse } from 'src/_common/response/blog.response';

export class RestoreBlogRes {
  @ApiProperty()
  blog: BlogResponse;
}

export class RestoreBlogResDTO extends BaseResponse<RestoreBlogRes> {
  @ApiProperty()
  declare data: RestoreBlogRes;
}
