import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseMessage } from '../enum/response.message.enum';
import { BaseResponse } from 'src/_base/response/base.response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    let responseMessage: ResponseMessage;

    switch (status) {
      case 404:
        responseMessage = ResponseMessage.NOT_FOUND;
        break;
      case 401:
        responseMessage = ResponseMessage.UN_AUTHORIZATION;
        break;
      case 403:
        responseMessage = ResponseMessage.FORBIDDEN;
        break;
      case 408:
        responseMessage = ResponseMessage.REQUEST_TIMEOUT;
        break;
      case 400:
        responseMessage = ResponseMessage.BAD_REQUEST;
        break;
      default:
        responseMessage = ResponseMessage.BAD_GATEWAY;
        break;
    }

    response
      .status(status)
      .json(new BaseResponse(null, responseMessage, exception.message, false));
  }
}
