import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import {
  DtoPrefix,
  DtoValidation,
  getValidateMessage,
} from 'src/_common/enum/dto.validation.enum';

export class CreateBlogReqDTO {
  @ApiProperty()
  @MaxLength(130, {
    message: getValidateMessage(DtoPrefix.TITLE, DtoValidation.MAX_LENGTH, 130),
  })
  @MinLength(15, {
    message: getValidateMessage(DtoPrefix.TITLE, DtoValidation.MIN_LENGTH, 15),
  })
  @IsString({
    message: getValidateMessage(DtoPrefix.TITLE, DtoValidation.NUMB_BE_STRING),
  })
  @IsNotEmpty({
    message: getValidateMessage(DtoPrefix.TITLE, DtoValidation.NOT_EMPTY),
  })
  title: string;

  @ApiProperty()
  @MinLength(30, {
    message: getValidateMessage(
      DtoPrefix.CONTENT,
      DtoValidation.MIN_LENGTH,
      30,
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
