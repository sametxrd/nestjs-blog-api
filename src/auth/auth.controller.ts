import { LoginRes, LoginResDTO } from './dto/res/login.res.dto';
import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterReqDTO } from './dto/req/register.req.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import express from 'express';
import { RegisterRes, RegisterResDTO } from './dto/res/register.res.dto';
import { ResponseMessage } from 'src/_common/enum/response.message.enum';
import { LoginReqDTO } from './dto/req/login.req.dto';
import {
  RefreshTokenRes,
  RefreshTokenResDTO,
} from './dto/res/refresh.token.res.dto';
import { AuthGuard } from 'src/_common/guard/auth.guard';
import { metadata } from 'reflect-metadata/no-conflict';
import { UserRole } from 'src/_common/enum/user.enum';
import { SoftDeleteRes, SoftDeleteResDTO } from './dto/res/soft.delete.res.dto';
import { RestoreAccountReqDTO } from './dto/req/restore.account.req.dto';
import {
  RestoreAccountRes,
  RestoreAccountResDTO,
} from './dto/res/restore.account.res.dto';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { BaseResponse } from 'src/_base/response/base.response';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: join(__dirname, '../../public/media/user'),
        filename: (req, file, cb) => {
          const newFileName =
            Date.now() +
            Math.floor(Math.random() * 9999999999) +
            extname(file.originalname);

          cb(null, newFileName);
        },
      }),

      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Sadece resim dosyaları!'), false);
        }

        cb(null, true);
      },

      limits: {
        fileSize: 8 * 1024 * 1024,
      },
    }),
  )
  @ApiResponse({ type: RegisterResDTO })
  async register(
    @Body() body: RegisterReqDTO,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: express.Response<RegisterResDTO>,
  ) {
    const data: RegisterRes = await this.authService.register(body, res, file);

    res.status(HttpStatus.CREATED).json({
      data: data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }

  @Post('login')
  @ApiResponse({ type: LoginResDTO })
  async login(
    @Body() body: LoginReqDTO,
    @Res() res: express.Response<LoginResDTO>,
  ) {
    const data: LoginRes = await this.authService.login(body, res);

    res.status(HttpStatus.OK).json({
      data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }

  @Post('refresh-token')
  @ApiResponse({ type: RefreshTokenResDTO })
  async refresh_token(
    @Req() req: express.Request,
    @Res() res: express.Response<RefreshTokenResDTO>,
  ) {
    const data: RefreshTokenRes = await this.authService.refresh_token(
      req,
      res,
    );

    res.status(HttpStatus.OK).json({
      data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }

  @Delete('delete-account/:id')
  @UseGuards(AuthGuard)
  @metadata('roles', [UserRole.USER, UserRole.MODERATOR])
  @ApiResponse({ type: SoftDeleteResDTO })
  async soft_delete_account(
    @Param('id') id: number,
    @Req() req: express.Request,
    @Res() res: express.Response<SoftDeleteResDTO>,
  ) {
    const data: SoftDeleteRes = await this.authService.soft_delete_account(
      id,
      req,
      res,
    );

    res.status(HttpStatus.OK).json({
      data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }

  @Post('restore-account')
  @ApiResponse({ type: RestoreAccountResDTO })
  async restore_account(
    @Body() body: RestoreAccountReqDTO,
    @Res() res: express.Response<RestoreAccountResDTO>,
  ) {
    const data: RestoreAccountRes = await this.authService.restore_account(
      body,
      res,
    );

    res.status(HttpStatus.OK).json({
      data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @metadata('roles', [UserRole.USER, UserRole.MODERATOR])
  async logout(@Res() res: express.Response<BaseResponse<boolean>>) {
    res.clearCookie('refresh_token');

    res.status(200).json({
      data: true,
      exception_message: null,
      response_message: ResponseMessage.SUCCESS,
      response: true,
    });
  }
}
