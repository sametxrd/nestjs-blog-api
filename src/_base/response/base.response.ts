import { ResponseMessage } from 'src/_common/enum/response.message.enum';

export class BaseResponse<T> {
  data: T;
  response_message: ResponseMessage;
  exception_message: string | null;
  response: boolean;

  constructor(
    data: T,
    response_message: ResponseMessage = ResponseMessage.SUCCESS,
    exception_message: string | null,
    response: boolean,
  ) {
    this.data = data;
    this.response_message = response_message;
    this.exception_message = exception_message;
    this.response = response;
  }
}
