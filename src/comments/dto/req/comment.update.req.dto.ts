import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import {
  DtoPrefix,
  DtoValidation,
  getValidateMessage,
} from 'src/_common/enum/dto.validation.enum';

export class CommentUpdateReqDTO {
  @ApiProperty()
  @MaxLength(300, {
    message: getValidateMessage(
      DtoPrefix.CONTENT,
      DtoValidation.MAX_LENGTH,
      300,
    ),
  })
  @IsString({
    message: getValidateMessage(
      DtoPrefix.CONTENT,
      DtoValidation.NUMB_BE_STRING,
    ),
  })
  @IsNotEmpty({
    message: getValidateMessage(DtoPrefix.CONTENT, DtoValidation.NOT_EMPTY),
  })
  content: string;
}
