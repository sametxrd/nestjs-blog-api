import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/_common/typeorm/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogReqDTO } from './dto/req/create.blog.req.dto';
import { Request } from 'express';
import { CreateBlogRes } from './dto/res/create.blog.res.dto';
import {
  ExceptionMessage,
  ExceptionPrefix,
  getExceptionMessage,
} from 'src/_common/enum/exception.message.enum';
import { AllBlogsRes } from './dto/res/all.blogs.res.dto';
import { BlogIdRes } from './dto/res/blog.id.res.dto';
import { UserRole } from 'src/_common/enum/user.enum';
import { SoftDeleteBlogRes } from './dto/res/soft.delete.blog.res.dto';
import { GetSoftDeleteBlogsRes } from './dto/res/get.soft.delete.blogs.res.dto';
import { RestoreBlogRes } from './dto/res/restore.blog.dto';
import { UpdateBlogReqDTO } from './dto/req/update.blog.req.dto';
import { UpdateBlogRes } from './dto/res/update.blog.req.dto';
import { PaginationRes } from './dto/res/pagination.res.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepo: Repository<Blog>,
  ) {}

  async createBlog(
    body: CreateBlogReqDTO,
    req: Request,
  ): Promise<CreateBlogRes> {
    const user = req['user'];

    const findBlogTitle: Blog | null = await this.blogRepo.findOne({
      where: { title: body.title },
      withDeleted: true,
    });

    if (findBlogTitle) {
      throw new BadRequestException(
        getExceptionMessage(
          ExceptionPrefix.BLOG,
          ExceptionMessage.ALREADY_HAVE,
        ),
      );
    }

    const newBlog = this.blogRepo.create({
      title: body.title,
      content: body.content,
      user: {
        id: user.id,
      },
    });

    const createdBlog = await this.blogRepo.save(newBlog);

    return {
      blog: {
        id: createdBlog.id,
        title: createdBlog.title,
        content: createdBlog.content,
        blog_status: createdBlog.blog_status,
        is_home: createdBlog.is_home,
        createdAt: createdBlog.createdAt,
        updatedAt: createdBlog.updatedAt,
        deletedAt: createdBlog.deletedAt,
      },
    };
  }

  async getAllBlogs(): Promise<AllBlogsRes> {
    const findAllBlogs: Array<Blog> | null = await this.blogRepo.find({
      relations: { user: true, blog_photos: true, comments: { user: true } },
      select: {
        user: {
          id: true,
          display_username: true,
          avatarUrl: true,
          user_role: true,
        },
        comments: {
          id: true,
          content: true,
          createdAt: true,
          deletedAt: true,
          updatedAt: true,
          user: {
            id: true,
            display_username: true,
            avatarUrl: true,
            user_role: true,
          },
        },
      },
    });

    if (!findAllBlogs) {
      throw new NotFoundException(
        getExceptionMessage(ExceptionPrefix.BLOG, ExceptionMessage.NOT_FOUND),
      );
    }

    return {
      blogs: findAllBlogs,
    };
  }

  async getBlogById(id: number): Promise<BlogIdRes> {
    const findBlogById: Blog | null = await this.blogRepo.findOne({
      where: { id },
      relations: { user: true, blog_photos: true, comments: { user: true } },
      select: {
        user: {
          id: true,
          display_username: true,
          avatarUrl: true,
          user_role: true,
        },
        comments: {
          id: true,
          content: true,
          createdAt: true,
          deletedAt: true,
          updatedAt: true,
          user: {
            id: true,
            display_username: true,
            avatarUrl: true,
            user_role: true,
          },
        },
      },
    });

    if (!findBlogById) {
      throw new NotFoundException(
        getExceptionMessage(ExceptionPrefix.BLOG, ExceptionMessage.NOT_FOUND),
      );
    }

    return {
      blog: findBlogById,
    };
  }

  async pagination(page: number, limit: number = 5): Promise<PaginationRes> {
    page = page < 1 ? 1 : page;
    limit = limit < 1 ? 1 : limit > 10 ? 10 : limit;

    const findBlogs = await this.blogRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: { user: true, blog_photos: true, comments: { user: true } },
      select: {
        user: {
          id: true,
          display_username: true,
          avatarUrl: true,
          user_role: true,
        },
        comments: {
          id: true,
          content: true,
          createdAt: true,
          deletedAt: true,
          updatedAt: true,
          user: {
            id: true,
            display_username: true,
            avatarUrl: true,
            user_role: true,
          },
        },
      },
    });

    return {
      blogs: findBlogs[0],
      total: findBlogs[1],
    };
  }

  async soft_delete_blog(id: number, req: Request): Promise<SoftDeleteBlogRes> {
    const user = req['user'];
    const findBlogById: Blog | null = await this.blogRepo.findOne({
      where: { id: id },
      select: {
        user: {
          id: true,
        },
      },
      relations: { user: true },
    });

    if (!findBlogById) {
      throw new NotFoundException(
        getExceptionMessage(ExceptionPrefix.BLOG, ExceptionMessage.NOT_FOUND),
      );
    }

    if (findBlogById.user.id !== user.id) {
      if (
        user.user_role !== UserRole.MODERATOR ||
        user.user_role !== UserRole.ADMIN
      ) {
        throw new NotFoundException(
          getExceptionMessage(ExceptionPrefix.BLOG, ExceptionMessage.NOT_OWNER),
        );
      }
    }

    await this.blogRepo.softDelete(id);

    return {
      id: findBlogById.id,
      title: findBlogById.title,
    };
  }

  async get_soft_delete_blogs(
    id: number,
    req: Request,
  ): Promise<GetSoftDeleteBlogsRes> {
    const user = req['user'];

    if (user.id !== id) {
      throw new BadRequestException(
        getExceptionMessage(ExceptionPrefix.BLOG, ExceptionMessage.NOT_OWNER),
      );
    }

    const findBlogs: Array<Blog> | null = await this.blogRepo.find({
      where: {
        user: { id: id },
      },
      select: { user: { id: true } },
      withDeleted: true,
      relations: { user: true },
    });

    if (!findBlogs) {
      throw new NotFoundException(
        getExceptionMessage(ExceptionPrefix.BLOG, ExceptionMessage.NOT_FOUND),
      );
    }

    const deletedBlogs: Array<Blog> = [];

    for (const blog of findBlogs) {
      if (blog.deletedAt != null) {
        deletedBlogs.push(blog);
      }
    }

    return {
      blogs: deletedBlogs,
    };
  }

  async restore_blog(id: number, req: Request): Promise<RestoreBlogRes> {
    const findDeletedBlog: Blog | null = await this.blogRepo.findOne({
      where: { id },
      relations: { user: true },
      select: { user: { id: true } },
      withDeleted: true,
    });

    if (!findDeletedBlog) {
      throw new NotFoundException(
        getExceptionMessage(ExceptionPrefix.BLOG, ExceptionMessage.NOT_FOUND),
      );
    }

    if (findDeletedBlog.user.id !== req['user'].id) {
      throw new NotFoundException(
        getExceptionMessage(ExceptionPrefix.BLOG, ExceptionMessage.NOT_OWNER),
      );
    }

    await this.blogRepo.restore(id);

    return {
      blog: findDeletedBlog,
    };
  }

  async update_blog(
    id: number,
    req: Request,
    body: UpdateBlogReqDTO,
  ): Promise<UpdateBlogRes> {
    const findBlogId: Blog | null = await this.blogRepo.findOne({
      where: { id },
      relations: { user: true },
      select: { user: { id: true } },
    });

    const findBlogTitle: Blog | null = await this.blogRepo.findOne({
      where: { title: body.title },
      withDeleted: true,
    });

    if (findBlogTitle) {
      throw new BadRequestException(
        getExceptionMessage(
          ExceptionPrefix.BLOG,
          ExceptionMessage.ALREADY_HAVE,
        ),
      );
    }

    if (!findBlogId) {
      throw new NotFoundException(
        getExceptionMessage(ExceptionPrefix.BLOG, ExceptionMessage.NOT_FOUND),
      );
    }

    if (findBlogId.user.id !== req['user'].id) {
      throw new NotFoundException(
        getExceptionMessage(ExceptionPrefix.BLOG, ExceptionMessage.NOT_OWNER),
      );
    }

    await this.blogRepo.update(id, {
      title: body.title,
      content: body.content,
    });

    const newBlog: Blog | null = await this.blogRepo.findOne({
      where: { id },
    });

    if (!newBlog) {
      throw new NotFoundException(
        getExceptionMessage(ExceptionPrefix.BLOG, ExceptionMessage.NOT_FOUND),
      );
    }

    return {
      blog: newBlog,
    };
  }
}
