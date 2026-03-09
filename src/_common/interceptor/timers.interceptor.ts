import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TimersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    const ip = request.ip;
    const path = request.path;
    const method = request.method;
    const beforeMs = Date.now();

    return next.handle().pipe(
      tap(() => {
        const afterMs = Date.now();
        console.log(
          `[${ip}] | [${path} - ${method}] | [${afterMs - beforeMs}ms]`,
        );
      }),
    );
  }
}
