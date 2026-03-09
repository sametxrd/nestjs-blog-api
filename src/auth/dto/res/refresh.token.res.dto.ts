import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';

export class RefreshTokenRes {
  @ApiProperty()
  access_token: string;
}

export class RefreshTokenResDTO extends BaseResponse<RefreshTokenRes> {
  @ApiProperty()
  declare data: RefreshTokenRes;
}
