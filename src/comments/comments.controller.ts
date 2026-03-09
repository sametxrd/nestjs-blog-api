import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/_common/decarators/roles.decarator';
import { UserRole } from 'src/_common/enum/user.enum';
import { AuthGuard } from 'src/_common/guard/auth.guard';
import { CommentsService } from './comments.service';
import { CommentCreateReqDTO } from './dto/req/comment.create.req.dto';
import express from 'express';
import {
  CommentCreateRes,
  CommentCreateResDTO,
} from './dto/res/comment.create.res.dto';
import { ResponseMessage } from 'src/_common/enum/response.message.enum';
import { CommentUpdateReqDTO } from './dto/req/comment.update.req.dto';
import {
  CommentUpdateRes,
  CommentUpdateResDTO,
} from './dto/res/comment.update.res.dto';
import {
  CommentDeleteRes,
  CommentDeleteResDTO,
} from './dto/res/comment.delete.res.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('comments')
@UseGuards(AuthGuard)
@Roles([UserRole.USER, UserRole.MODERATOR])
export class CommentsController {
  constructor(
    @Inject(CommentsService) private readonly commentService: CommentsService,
  ) {}

  @Post(':id')
  @ApiResponse({ type: CommentCreateResDTO })
  async create_comment(
    @Param('id') id: number,
    @Body() body: CommentCreateReqDTO,
    @Req() req: express.Request,
    @Res() res: express.Response<CommentCreateResDTO>,
  ) {
    const data: CommentCreateRes = await this.commentService.create_comment(
      id,
      req,
      body,
    );

    res.status(HttpStatus.CREATED).json({
      data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }

  @Put(':id')
  @ApiResponse({ type: CommentUpdateResDTO })
  async update_comment(
    @Param('id') id: number,
    @Body() body: CommentUpdateReqDTO,
    @Req() req: express.Request,
    @Res() res: express.Response<CommentUpdateResDTO>,
  ) {
    const data: CommentUpdateRes = await this.commentService.update_comment(
      id,
      body,
      req,
    );

    res.status(HttpStatus.OK).json({
      data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }

  @Delete(':id')
  @ApiResponse({ type: CommentDeleteResDTO })
  async delete_comment(
    @Param('id') id: number,
    @Req() req: express.Request,
    @Res() res: express.Response<CommentDeleteResDTO>,
  ) {
    const data: CommentDeleteRes = await this.commentService.delete_comment(
      id,
      req,
    );

    res.status(HttpStatus.OK).json({
      data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }
}
