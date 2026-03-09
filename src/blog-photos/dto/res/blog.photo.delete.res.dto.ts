import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';

export class BlogPhotoDeleteRes {
  @ApiProperty()
  id: number;
  @ApiProperty()
  photo_url: string;
}

export class BlogPhotoDeleteResDTO extends BaseResponse<BlogPhotoDeleteRes> {
  @ApiProperty()
  declare data: BlogPhotoDeleteRes;
}
