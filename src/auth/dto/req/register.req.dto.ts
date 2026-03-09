import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  DtoPrefix,
  DtoValidation,
  getValidateMessage,
} from 'src/_common/enum/dto.validation.enum';

export class RegisterReqDTO {
  @ApiProperty()
  @MinLength(1, {
    message: getValidateMessage(
      DtoPrefix.DISPLAY_USERNAME,
      DtoValidation.MIN_LENGTH,
      1,
    ),
  })
  @MaxLength(30, {
    message: getValidateMessage(
      DtoPrefix.DISPLAY_USERNAME,
      DtoValidation.MAX_LENGTH,
      30,
    ),
  })
  @IsString({
    message: getValidateMessage(
      DtoPrefix.DISPLAY_USERNAME,
      DtoValidation.NUMB_BE_STRING,
    ),
  })
  @IsNotEmpty({
    message: getValidateMessage(
      DtoPrefix.DISPLAY_USERNAME,
      DtoValidation.NOT_EMPTY,
    ),
  })
  display_username: string;

  @ApiProperty()
  @MinLength(4, {
    message: getValidateMessage(
      DtoPrefix.GLOBAL_USERNAME,
      DtoValidation.MIN_LENGTH,
      4,
    ),
  })
  @MaxLength(20, {
    message: getValidateMessage(
      DtoPrefix.GLOBAL_USERNAME,
      DtoValidation.MAX_LENGTH,
      20,
    ),
  })
  @IsAlphanumeric('en-US', {
    message: getValidateMessage(
      DtoPrefix.GLOBAL_USERNAME,
      DtoValidation.NOT_ALPHA_NUMERIC,
    ),
  })
  @IsLowercase({
    message: getValidateMessage(
      DtoPrefix.GLOBAL_USERNAME,
      DtoValidation.NOT_LOWERCASE,
    ),
  })
  @IsString({
    message: getValidateMessage(
      DtoPrefix.GLOBAL_USERNAME,
      DtoValidation.NUMB_BE_STRING,
    ),
  })
  @IsNotEmpty({
    message: getValidateMessage(
      DtoPrefix.GLOBAL_USERNAME,
      DtoValidation.NOT_EMPTY,
    ),
  })
  global_username: string;

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
  @IsStrongPassword(
    {
      minLength: 6,
      minUppercase: 1,
      minLowercase: 3,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: getValidateMessage(DtoPrefix.PASSWORD, DtoValidation.NOT_STRONG),
    },
  )
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
