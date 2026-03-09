import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserRole } from '../enum/user.enum';
import { Request } from 'express';
import { JWTpayload } from '../interface/jwt.interface';
import { Roles } from '../decarators/roles.decarator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(Reflector) private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<UserRole[]>(Roles, context.getHandler());
    const request: Request = context.switchToHttp().getRequest();

    try {
      let token = request.headers.authorization?.replace('Bearer', '').trim();

      if (!token) throw new UnauthorizedException();

      const jwtPayload: JWTpayload = this.jwtService.verify(token);
      request['user'] = jwtPayload;
      
      if (!roles) return true;

      if (jwtPayload.user_role === UserRole.ADMIN) return true;

      if (roles.includes(jwtPayload.user_role)) return true;
      
      return false;
    } catch (err) {
      throw new ForbiddenException(err.message);
    }
  }
}
