import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';
import { BlogResponse } from 'src/_common/response/blog.response';

export class AllBlogsRes {
  @ApiProperty()
  blogs: BlogResponse[];
}

export class AllBlogsResDTO extends BaseResponse<AllBlogsRes> {
  @ApiProperty()
  declare data: AllBlogsRes;
}
