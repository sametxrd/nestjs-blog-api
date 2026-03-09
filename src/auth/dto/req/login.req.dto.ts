import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  DtoPrefix,
  DtoValidation,
  getValidateMessage,
} from 'src/_common/enum/dto.validation.enum';

export class LoginReqDTO {
  @ApiProperty()
  @MaxLength(100, {
    message: getValidateMessage(DtoPrefix.EMAIL, DtoValidation.MAX_LENGTH, 100),
  })
  @IsEmail(
    {},
    {
      message: getValidateMessage(DtoPrefix.EMAIL, DtoValidation.FORMAT_WRONG),
    },
  )
  @IsString({
    message: getValidateMessage(DtoPrefix.EMAIL, DtoValidation.NUMB_BE_STRING),
  })
  @IsNotEmpty({
    message: getValidateMessage(DtoPrefix.EMAIL, DtoValidation.NOT_EMPTY),
  })
  email: string;

  @ApiProperty()
  @MinLength(6, {
    message: getValidateMessage(
      DtoPrefix.PASSWORD,
      DtoValidation.MIN_LENGTH,
      6,
    ),
  })
  @MaxLength(30, {
    message: getValidateMessage(
      DtoPrefix.PASSWORD,
      DtoValidation.MAX_LENGTH,
      30,
    ),
  })
  @IsString({
    message: getValidateMessage(
      DtoPrefix.PASSWORD,
      DtoValidation.NUMB_BE_STRING,
    ),
  })
  @IsNotEmpty({
    message: getValidateMessage(DtoPrefix.PASSWORD, DtoValidation.NOT_EMPTY),
  })
  password: string;
}
