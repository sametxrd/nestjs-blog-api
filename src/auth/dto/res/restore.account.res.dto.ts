import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';
import { UserResponse } from 'src/_common/response/user.response';

export class RestoreAccountRes {
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  user: UserResponse;
}

export class RestoreAccountResDTO extends BaseResponse<RestoreAccountRes> {
  @ApiProperty()
  declare data: RestoreAccountRes;
}
