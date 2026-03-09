import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';
import { UserResponse } from 'src/_common/response/user.response';

export class LoginRes {
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  user: UserResponse;
}

export class LoginResDTO extends BaseResponse<LoginRes> {
  @ApiProperty()
  declare data: LoginRes;
}
