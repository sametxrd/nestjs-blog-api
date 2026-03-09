import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';

export class SoftDeleteBlogRes {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
}

export class SoftDeleteBlogResDTO extends BaseResponse<SoftDeleteBlogRes> {
  @ApiProperty()
  declare data: SoftDeleteBlogRes;
}
