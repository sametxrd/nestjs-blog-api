import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';
import { UserResponse } from 'src/_common/response/user.response';

export class RegisterRes {
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  user: UserResponse;
}

export class RegisterResDTO extends BaseResponse<RegisterRes> {
  @ApiProperty()
  declare data: RegisterRes;
}
