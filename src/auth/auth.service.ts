import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/_common/typeorm/user.entity';
import { Repository } from 'typeorm';
import { RegisterReqDTO } from './dto/req/register.req.dto';
import { unlink } from 'fs';
import {
  ExceptionMessage,
  ExceptionPrefix,
  getExceptionMessage,
} from 'src/_common/enum/exception.message.enum';
import * as bcrypt from 'bcrypt';
import { JWTpayload } from 'src/_common/interface/jwt.interface';
import { RegisterRes } from './dto/res/register.res.dto';
import { Request, Response } from 'express';
import { join } from 'path';
import { LoginReqDTO } from './dto/req/login.req.dto';
import { LoginRes } from './dto/res/login.res.dto';
import { RefreshTokenRes } from './dto/res/refresh.token.res.dto';
import { SoftDeleteRes } from './dto/res/soft.delete.res.dto';
import { RestoreAccountReqDTO } from './dto/req/restore.account.req.dto';
import { RestoreAccountRes } from './dto/res/restore.account.res.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async register(
    body: RegisterReqDTO,
    res: Response,
    file: Express.Multer.File,
  ): Promise<RegisterRes> {
    const findUserMail: User | null = await this.userRepo.findOne({
      where: { email: body.email },
      withDeleted: true,
    });

    const findUserName: User | null = await this.userRepo.findOne({
      where: { global_username: body.global_username },
      withDeleted: true,
    });

    if (findUserMail || findUserName) {
      unlink(
        join(__dirname, `../../public/media/user/${file.filename}`),
        (err) => {
          if (err) {
            console.log(err);
          }
        },
      );

      throw new BadRequestException(
        getExceptionMessage(
          ExceptionPrefix.USER,
          ExceptionMessage.ALREADY_HAVE_ACC,
        ),
      );
    }

    const hashedPassword: string = await bcrypt.hash(body.password, 10);

    const newUser: User = this.userRepo.create({
      avatarUrl: file.filename,
      global_username: body.global_username,
      display_username: body.display_username,
      email: body.email,
      password: hashedPassword,
    });

    const createdUser: User = await this.userRepo.save(newUser);

    const jwtPayload: JWTpayload = {
      id: createdUser.id,
      global_username: createdUser.global_username,
      user_role: createdUser.user_role,
    };

    const access_token: string = this.jwtService.sign(jwtPayload);
    const refresh_token: string = this.jwtService.sign(jwtPayload, {
      expiresIn: '30d',
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return {
      access_token: access_token,
      user: {
        id: createdUser.id,
        avatar_url: createdUser.avatarUrl,
        display_username: createdUser.display_username,
        global_username: createdUser.global_username,
        user_role: createdUser.user_role,
      },
    };
  }

  async login(body: LoginReqDTO, res: Response): Promise<LoginRes> {
    const findUserMail: User | null = await this.userRepo.findOneBy({
      email: body.email,
    });

    if (!findUserMail) {
      throw new NotFoundException(
        getExceptionMessage(
          ExceptionPrefix.EMAIL,
          ExceptionMessage.NOT_FOUND_ACC,
        ),
      );
    }

    const checkPassword: boolean = await bcrypt.compare(
      body.password,
      findUserMail.password,
    );

    if (!checkPassword) {
      throw new BadRequestException(
        getExceptionMessage(ExceptionPrefix.PASSWORD, ExceptionMessage.WRONG),
      );
    }

    const payload: JWTpayload = {
      id: findUserMail.id,
      global_username: findUserMail.global_username,
      user_role: findUserMail.user_role,
    };

    const access_token: string = this.jwtService.sign(payload);
    const refresh_token: string = this.jwtService.sign(payload, {
      expiresIn: '30d',
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: 'strict',
    });

    return {
      access_token,
      user: {
        id: findUserMail.id,
        avatar_url: findUserMail.avatarUrl,
        display_username: findUserMail.display_username,
        global_username: findUserMail.global_username,
        user_role: findUserMail.user_role,
      },
    };
  }

  async refresh_token(req: Request, res: Response): Promise<RefreshTokenRes> {
    try {
      const refresh_token: JWTpayload = await this.jwtService.verify(
        req.cookies['refresh_token'],
      );
      if (!req.headers.authorization) {
        throw new BadRequestException(
          getExceptionMessage(
            ExceptionPrefix.ACCESS_TOKEN,
            ExceptionMessage.NOT_FOUND,
          ),
        );
      }

      const access_token: JWTpayload = await this.jwtService.decode(
        req.headers.authorization.replace('Bearer', '').trim(),
      );

      if (access_token.id !== refresh_token.id) {
        throw new BadRequestException(
          getExceptionMessage(ExceptionPrefix.TOKEN, ExceptionMessage.WRONG),
        );
      }

      const payload: JWTpayload = {
        id: refresh_token.id,
        global_username: refresh_token.global_username,
        user_role: refresh_token.user_role,
      };

      const new_access_token: string = this.jwtService.sign(payload);

      return {
        access_token: new_access_token,
      };
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }

  async soft_delete_account(
    id: number,
    req: Request,
    res: Response,
  ): Promise<SoftDeleteRes> {
    let token: string | undefined = req.headers.authorization
      ?.replace('Bearer', '')
      .trim();

    if (!token) throw new UnauthorizedException();

    const jwtPayload: JWTpayload = this.jwtService.verify(token);

    if (jwtPayload.id !== id) throw new BadRequestException();

    await this.userRepo.softDelete(id);

    res.clearCookie('refresh_token');

    return {
      username: jwtPayload.global_username,
    };
  }

  async restore_account(
    body: RestoreAccountReqDTO,
    res: Response,
  ): Promise<RestoreAccountRes> {
    const findUserMail: User | null = await this.userRepo.findOne({
      withDeleted: true,
      where: {
        email: body.email,
      },
    });

    if (!findUserMail) {
      throw new NotFoundException(
        getExceptionMessage(
          ExceptionPrefix.EMAIL,
          ExceptionMessage.NOT_FOUND_ACC,
        ),
      );
    }

    const checkPassword: boolean = await bcrypt.compare(
      body.password,
      findUserMail.password,
    );

    if (!checkPassword) {
      throw new BadRequestException(
        getExceptionMessage(ExceptionPrefix.PASSWORD, ExceptionMessage.WRONG),
      );
    }

    const payload: JWTpayload = {
      id: findUserMail.id,
      global_username: findUserMail.global_username,
      user_role: findUserMail.user_role,
    };

    const access_token: string = this.jwtService.sign(payload);
    const refresh_token: string = this.jwtService.sign(payload, {
      expiresIn: '30d',
    });

    await this.userRepo.restore({ id: findUserMail.id });

    res.cookie('refresh_token', refresh_token);

    return {
      access_token,
      user: {
        id: findUserMail.id,
        display_username: findUserMail.display_username,
        global_username: findUserMail.global_username,
        avatar_url: findUserMail.avatarUrl,
        user_role: findUserMail.user_role,
      },
    };
  }
}
