import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';

export class CommentCreateRes {
  @ApiProperty()
  content: string;
}

export class CommentCreateResDTO extends BaseResponse<CommentCreateRes> {
  @ApiProperty()
  declare data: CommentCreateRes;
}
