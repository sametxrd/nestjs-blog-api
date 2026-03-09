import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';
import { BlogResponse } from 'src/_common/response/blog.response';

export class GetSoftDeleteBlogsRes {
  @ApiProperty()
  blogs: BlogResponse[];
}

export class GetSoftDeleteBlogsResDTO extends BaseResponse<GetSoftDeleteBlogsRes> {
  @ApiProperty()
  declare data: GetSoftDeleteBlogsRes;
}
