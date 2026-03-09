import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';

export class CommentUpdateRes {
  @ApiProperty()
  content: string;
}

export class CommentUpdateResDTO extends BaseResponse<CommentUpdateRes> {
  @ApiProperty()
  declare data: CommentUpdateRes;
}
