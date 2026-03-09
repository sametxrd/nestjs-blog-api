import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';

export class SoftDeleteRes {
  @ApiProperty()
  username: string;
}

export class SoftDeleteResDTO extends BaseResponse<SoftDeleteRes> {
  @ApiProperty()
  declare data: SoftDeleteRes;
}
