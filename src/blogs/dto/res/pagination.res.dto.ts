import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';
import { BlogResponse } from 'src/_common/response/blog.response';

export class PaginationRes {
  @ApiProperty()
  blogs: BlogResponse[];
  @ApiProperty()
  total: number;
}

export class PaginationResDTO extends BaseResponse<PaginationRes> {
  @ApiProperty()
  declare data: PaginationRes;
}
