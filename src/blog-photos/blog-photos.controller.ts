import {
  BadRequestException,
  Controller,
  Delete,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BlogPhotosService } from './blog-photos.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { AuthGuard } from 'src/_common/guard/auth.guard';
import { Roles } from 'src/_common/decarators/roles.decarator';
import { UserRole } from 'src/_common/enum/user.enum';
import express from 'express';
import {
  BlogPhotosCreateRes,
  BlogPhotosCreateResDTO,
} from './dto/res/blog.photos.create.res.dto';
import { ResponseMessage } from 'src/_common/enum/response.message.enum';
import {
  BlogPhotoUpdateRes,
  BlogPhotoUpdateResDTO,
} from './dto/res/blog.photo.update.res.dto';
import {
  BlogPhotoDeleteRes,
  BlogPhotoDeleteResDTO,
} from './dto/res/blog.photo.delete.res.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('blog-photos')
@UseGuards(AuthGuard)
@Roles([UserRole.USER, UserRole.MODERATOR])
export class BlogPhotosController {
  constructor(
    @Inject(BlogPhotosService)
    private readonly blogPhotoService: BlogPhotosService,
  ) {}

  @Post(':id')
  @UseInterceptors(
    FilesInterceptor('blog_photos', 5, {
      storage: diskStorage({
        destination: join(__dirname, '../../public/media/blog-photos'),
        filename: (req, file, cb) => {
          const newFileName: string =
            Date.now() +
            Math.floor(Math.random() * 9999999999) +
            extname(file.originalname);

          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const trueTypes: Array<string> = ['image/jpg', 'image/jpeg'];

        if (!trueTypes.includes(file.mimetype)) {
          return cb(new BadRequestException('Sadece resim dosyaları!'), false);
        }

        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiResponse({ type: BlogPhotosCreateResDTO })
  async createBlogPhotos(
    @Param('id') id: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: express.Request,
    @Res() res: express.Response<BlogPhotosCreateResDTO>,
  ) {
    const data: BlogPhotosCreateRes =
      await this.blogPhotoService.createBlogPhotos(id, files, req);

    res.status(HttpStatus.CREATED).json({
      data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('blog_photo', {
      storage: diskStorage({
        destination: join(__dirname, '../../public/media/blog-photos'),
        filename: (req, file, cb) => {
          const newFileName: string =
            Date.now() +
            Math.floor(Math.random() * 9999999999) +
            extname(file.originalname);

          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const trueTypes: Array<string> = ['image/jpg', 'image/jpeg'];

        if (!trueTypes.includes(file.mimetype)) {
          return cb(new BadRequestException('Sadece resim dosyaları!'), false);
        }

        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiResponse({ type: BlogPhotoUpdateResDTO })
  async updateBlogPhoto(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: express.Request,
    @Res() res: express.Response<BlogPhotoUpdateResDTO>,
  ) {
    const data: BlogPhotoUpdateRes =
      await this.blogPhotoService.updateBlogPhoto(id, file, req);

    res.status(HttpStatus.OK).json({
      data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }

  @Delete(':id')
  @ApiResponse({ type: BlogPhotoDeleteResDTO })
  async deleteBlogPhoto(
    @Param('id') id: number,
    @Req() req: express.Request,
    @Res() res: express.Response<BlogPhotoDeleteResDTO>,
  ) {
    const data: BlogPhotoDeleteRes =
      await this.blogPhotoService.deleteBlogPhoto(id, req);

    res.status(HttpStatus.OK).json({
      data,
      response_message: ResponseMessage.SUCCESS,
      exception_message: null,
      response: true,
    });
  }
}
