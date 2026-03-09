import { RestoreBlogRes, RestoreBlogResDTO } from './dto/res/restore.blog.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogReqDTO } from './dto/req/create.blog.req.dto';
import { AuthGuard } from 'src/_common/guard/auth.guard';
import { UserRole } from 'src/_common/enum/user.enum';
import express from 'express';
import { Roles } from 'src/_common/decarators/roles.decarator';
import { CreateBlogRes, CreateBlogResDTO } from './dto/res/create.blog.res.dto';
import { ResponseMessage } from 'src/_common/enum/response.message.enum';
import { AllBlogsRes, AllBlogsResDTO } from './dto/res/all.blogs.res.dto';
import { BlogIdRes, BlogIdResDTO } from './dto/res/blog.id.res.dto';
import {
  SoftDeleteBlogRes,
  SoftDeleteBlogResDTO,
} from './dto/res/soft.delete.blog.res.dto';
import {
  GetSoftDeleteBlogsRes,
  GetSoftDeleteBlogsResDTO,
} from './dto/res/get.soft.delete.blogs.res.dto';
import { UpdateBlogRes, UpdateBlogResDTO } from './dto/res/update.blog.req.dto';
import { UpdateBlogReqDTO } from './dto/req/update.blog.req.dto';
import { ApiResponse } from '@nestjs/swagger';
import { PaginationRes, PaginationResDTO } from './dto/res/pagination.res.dto';

@Controller('blogs')
@UseGuards(AuthGuard)
export class BlogsController {
  constructor(
    @Inject(BlogsService) private readonly blogService: BlogsService,
  ) {}

  @Post()
  @Roles([UserRole.USER, UserRole.MODERATOR])
  @ApiResponse({ type: CreateBlogResDTO })
  async createBlog(
    @Body() Body: CreateBlogReqDTO,
    @Req() req: express.Request,
    @Res() res: express.Response<CreateBlogResDTO>,
  ) {
    const data: CreateBlogRes = await this.blogService.createBlog(Body, req);

    res.status(HttpStatus.CREATED).json({
      data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }

  @Get()
  @Roles([UserRole.USER, UserRole.MODERATOR])
  @ApiResponse({ type: AllBlogsResDTO })
  async getAllBlogs(@Res() res: express.Response<AllBlogsResDTO>) {
    const data: AllBlogsRes = await this.blogService.getAllBlogs();

    res.status(HttpStatus.OK).json({
      data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }

  @Get('pagination')
  @Roles([UserRole.USER, UserRole.MODERATOR])
  @ApiResponse({ type: PaginationResDTO })
  async pagination(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: express.Response<PaginationResDTO>,
  ) {
    const data: PaginationRes = await this.blogService.pagination(
      Number(page),
      Number(limit),
    );

    res.status(HttpStatus.OK).json({
      data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }

  @Get(':id')
  @Roles([UserRole.USER, UserRole.MODERATOR])
  @ApiResponse({ type: BlogIdResDTO })
  async getBlogById(
    @Param('id') id: number,
    @Res() res: express.Response<BlogIdResDTO>,
  ) {
    const data: BlogIdRes = await this.blogService.getBlogById(id);

    res.status(HttpStatus.OK).json({
      data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }

  @Delete(':id')
  @Roles([UserRole.USER, UserRole.MODERATOR])
  @ApiResponse({ type: SoftDeleteBlogResDTO })
  async soft_delete_blog(
    @Param('id') id: number,
    @Req() req: express.Request,
    @Res() res: express.Response<SoftDeleteBlogResDTO>,
  ) {
    const data: SoftDeleteBlogRes = await this.blogService.soft_delete_blog(
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

  @Get('delete-blogs/user/:id')
  @Roles([UserRole.USER, UserRole.MODERATOR])
  @ApiResponse({ type: GetSoftDeleteBlogsResDTO })
  async get_soft_delete_blogs(
    @Param('id') id: number,
    @Req() req: express.Request,
    @Res() res: express.Response<GetSoftDeleteBlogsResDTO>,
  ) {
    const data: GetSoftDeleteBlogsRes =
      await this.blogService.get_soft_delete_blogs(id, req);

    res.status(HttpStatus.OK).json({
      data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }

  @Post('restore/:id')
  @Roles([UserRole.USER, UserRole.MODERATOR])
  @ApiResponse({ type: RestoreBlogResDTO })
  async restore_blog(
    @Param('id') id: number,
    @Req() req: express.Request,
    @Res() res: express.Response<RestoreBlogResDTO>,
  ) {
    const data: RestoreBlogRes = await this.blogService.restore_blog(id, req);

    res.status(HttpStatus.OK).json({
      data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }

  @Put(':id')
  @Roles([UserRole.USER, UserRole.MODERATOR])
  @ApiResponse({ type: UpdateBlogResDTO })
  async update_blog(
    @Param('id') id: number,
    @Body() body: UpdateBlogReqDTO,
    @Req() req: express.Request,
    @Res() res: express.Response<UpdateBlogResDTO>,
  ) {
    const data: UpdateBlogRes = await this.blogService.update_blog(
      id,
      req,
      body,
    );

    res.status(HttpStatus.OK).json({
      data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }
}
