import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';

export class CommentDeleteRes {
  @ApiProperty()
  id: number;
  @ApiProperty()
  content: string;
}

export class CommentDeleteResDTO extends BaseResponse<CommentDeleteRes> {
  @ApiProperty()
  declare data: CommentDeleteRes;
}
