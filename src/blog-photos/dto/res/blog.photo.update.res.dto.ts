import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';

export class BlogPhotoUpdateRes {
  @ApiProperty()
  photo_url: string;
}

export class BlogPhotoUpdateResDTO extends BaseResponse<BlogPhotoUpdateRes> {
  @ApiProperty()
  declare data: BlogPhotoUpdateRes;
}
