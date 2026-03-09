import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/_common/typeorm/blog.entity';
import { Comment } from 'src/_common/typeorm/comment.entity';
import { Repository } from 'typeorm';
import { CommentCreateReqDTO } from './dto/req/comment.create.req.dto';
import { CommentCreateRes } from './dto/res/comment.create.res.dto';
import { Request } from 'express';
import { CommentUpdateReqDTO } from './dto/req/comment.update.req.dto';
import {
  ExceptionMessage,
  ExceptionPrefix,
  getExceptionMessage,
} from 'src/_common/enum/exception.message.enum';
import { CommentUpdateRes } from './dto/res/comment.update.res.dto';
import { CommentDeleteRes } from './dto/res/comment.delete.res.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepo: Repository<Blog>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async create_comment(
    id: number,
    req: Request,
    body: CommentCreateReqDTO,
  ): Promise<CommentCreateRes> {
    const user = req['user'];

    const newComment: Comment = this.commentRepo.create({
      content: body.content,
      blog: { id: id },
      user: { id: user.id },
    });

    const createdComment: Comment = await this.commentRepo.save(newComment);

    return {
      content: createdComment.content,
    };
  }

  async update_comment(
    id: number,
    body: CommentUpdateReqDTO,
    req: Request,
  ): Promise<CommentUpdateRes> {
    const user = req['user'];
    const findComment: Comment | null = await this.commentRepo.findOne({
      where: { id },
      relations: { user: true },
      select: { user: { id: true } },
    });

    if (!findComment) {
      throw new NotFoundException(
        getExceptionMessage(
          ExceptionPrefix.COMMENT,
          ExceptionMessage.NOT_FOUND,
        ),
      );
    }

    if (user.id !== findComment.user.id) {
      throw new BadRequestException(
        getExceptionMessage(
          ExceptionPrefix.COMMENT,
          ExceptionMessage.NOT_OWNER,
        ),
      );
    }

    await this.commentRepo.update(id, {
      content: body.content,
    });

    return {
      content: body.content,
    };
  }

  async delete_comment(id: number, req: Request): Promise<CommentDeleteRes> {
    const user = req['user'];
    const findComment: Comment | null = await this.commentRepo.findOne({
      where: { id },
      relations: { user: true },
      select: { user: { id: true } },
    });

    if (!findComment) {
      throw new NotFoundException(
        getExceptionMessage(
          ExceptionPrefix.COMMENT,
          ExceptionMessage.NOT_FOUND,
        ),
      );
    }

    if (user.id !== findComment.user.id) {
      throw new BadRequestException(
        getExceptionMessage(
          ExceptionPrefix.COMMENT,
          ExceptionMessage.NOT_OWNER,
        ),
      );
    }

    await this.commentRepo.delete(id);

    return {
      id: findComment.id,
      content: findComment.content,
    };
  }
}
