import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';

export class BlogPhotosCreateRes {
  @ApiProperty()
  photo_urls: Array<string>;
}

export class BlogPhotosCreateResDTO extends BaseResponse<BlogPhotosCreateRes> {
  @ApiProperty()
  declare data: BlogPhotosCreateRes;
}
