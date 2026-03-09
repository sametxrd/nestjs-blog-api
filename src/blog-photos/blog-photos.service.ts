import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { existsSync, unlink } from 'fs';
import { join } from 'path';
import {
  ExceptionMessage,
  ExceptionPrefix,
  getExceptionMessage,
} from 'src/_common/enum/exception.message.enum';
import { Blog } from 'src/_common/typeorm/blog.entity';
import { BlogPhoto } from 'src/_common/typeorm/blog.photo.entity';
import { Repository } from 'typeorm';
import { BlogPhotosCreateRes } from './dto/res/blog.photos.create.res.dto';
import { BlogPhotoUpdateRes } from './dto/res/blog.photo.update.res.dto';
import { BlogPhotoDeleteRes } from './dto/res/blog.photo.delete.res.dto';

@Injectable()
export class BlogPhotosService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
    @InjectRepository(BlogPhoto)
    private readonly blogPhotoRepo: Repository<BlogPhoto>,
  ) {}

  async createBlogPhotos(
    id: number,
    files: Array<Express.Multer.File>,
    req: Request,
  ): Promise<BlogPhotosCreateRes> {
    const findBlog: Blog | null = await this.blogRepo.findOne({
      where: { id },
      select: { user: { id: true }, blog_photos: { id: true } },
      relations: { user: true, blog_photos: true },
    });

    const user = req['user'];

    if (!findBlog) {
      for (const file of files) {
        if (
          existsSync(
            join(__dirname, `../../public/media/blog-photos/${file.filename}`),
          )
        ) {
          unlink(
            join(__dirname, `../../public/media/blog-photos/${file.filename}`),
            (err) => {
              if (err) console.log(err.message);
            },
          );
        }
      }
      throw new NotFoundException(
        getExceptionMessage(ExceptionPrefix.BLOG, ExceptionMessage.NOT_FOUND),
      );
    }

    if (user.id !== findBlog.user.id) {
      for (const file of files) {
        if (
          existsSync(
            join(__dirname, `../../public/media/blog-photos/${file.filename}`),
          )
        ) {
          unlink(
            join(__dirname, `../../public/media/blog-photos/${file.filename}`),
            (err) => {
              if (err) console.log(err.message);
            },
          );
        }
      }
      throw new BadRequestException(
        getExceptionMessage(ExceptionPrefix.BLOG, ExceptionMessage.NOT_OWNER),
      );
    }

    if (findBlog.blog_photos.length >= 5) {
      for (const file of files) {
        if (
          existsSync(
            join(__dirname, `../../public/media/blog-photos/${file.filename}`),
          )
        ) {
          unlink(
            join(__dirname, `../../public/media/blog-photos/${file.filename}`),
            (err) => {
              if (err) console.log(err.message);
            },
          );
        }
      }
      throw new BadRequestException(
        getExceptionMessage(
          ExceptionPrefix.BLOG_PHOTOS,
          ExceptionMessage.LIMITED,
        ),
      );
    }

    let fileUrlList: Array<string> = [];

    for (const file of files) {
      const newPhoto = this.blogPhotoRepo.create({
        blog_photo_url: file.filename,
        blog: { id: findBlog.id },
      });

      await this.blogPhotoRepo.save(newPhoto);
      fileUrlList.push(file.filename);
    }

    return {
      photo_urls: fileUrlList,
    };
  }

  async updateBlogPhoto(
    id: number,
    file: Express.Multer.File,
    req: Request,
  ): Promise<BlogPhotoUpdateRes> {
    const findBlogPhoto: BlogPhoto | null = await this.blogPhotoRepo.findOne({
      where: { id },
      select: { blog: { id: true, user: { id: true } } },
      relations: { blog: { user: true } },
    });

    const user = req['user'];

    if (!findBlogPhoto) {
      if (
        existsSync(
          join(__dirname, `../../public/media/blog-photos/${file.filename}`),
        )
      ) {
        unlink(
          join(__dirname, `../../public/media/blog-photos/${file.filename}`),
          (err) => {
            if (err) console.log(err.message);
          },
        );
      }
      throw new NotFoundException(
        getExceptionMessage(
          ExceptionPrefix.BLOG_PHOTOS,
          ExceptionMessage.NOT_FOUND,
        ),
      );
    }

    if (user.id !== findBlogPhoto.blog.user.id) {
      if (
        existsSync(
          join(__dirname, `../../public/media/blog-photos/${file.filename}`),
        )
      ) {
        unlink(
          join(__dirname, `../../public/media/blog-photos/${file.filename}`),
          (err) => {
            if (err) console.log(err.message);
          },
        );
      }
      throw new BadRequestException(
        getExceptionMessage(ExceptionPrefix.BLOG, ExceptionMessage.NOT_OWNER),
      );
    }

    await this.blogPhotoRepo.update(id, {
      blog_photo_url: file.filename,
    });

    unlink(
      join(
        __dirname,
        `../../public/media/blog-photos/${findBlogPhoto.blog_photo_url}`,
      ),
      (err) => {
        if (err) console.log(err.message);
      },
    );

    return {
      photo_url: file.filename,
    };
  }

  async deleteBlogPhoto(id: number, req: Request): Promise<BlogPhotoDeleteRes> {
    const findBlogPhoto: BlogPhoto | null = await this.blogPhotoRepo.findOne({
      where: { id },
      select: { blog: { id: true, user: { id: true } } },
      relations: { blog: { user: true } },
    });

    const user = req['user'];

    if (!findBlogPhoto) {
      throw new NotFoundException(
        getExceptionMessage(
          ExceptionPrefix.BLOG_PHOTOS,
          ExceptionMessage.NOT_FOUND,
        ),
      );
    }

    if (user.id !== findBlogPhoto.blog.user.id) {
      throw new BadRequestException(
        getExceptionMessage(ExceptionPrefix.BLOG, ExceptionMessage.NOT_OWNER),
      );
    }

    await this.blogPhotoRepo.delete(id);

    unlink(
      join(
        __dirname,
        `../../public/media/blog-photos/${findBlogPhoto.blog_photo_url}`,
      ),
      (err) => {
        if (err) console.log(err.message);
      },
    );

    return {
      id: findBlogPhoto.id,
      photo_url: findBlogPhoto.blog_photo_url,
    };
  }
}
