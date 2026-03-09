export enum DtoPrefix {
  GLOBAL_USERNAME = 'GLOBAL_USERNAME',
  DISPLAY_USERNAME = 'DISPLAY_USERNAME',
  EMAIL = 'EMAIL',
  PASSWORD = 'PASSWORD',
  TITLE = 'TITLE',
  CONTENT = 'CONTENT',
}

export enum DtoValidation {
  NUMB_BE_STRING = 'NUMB_BE_STRING',
  NUMB_BE_NUMBER = 'NUMB_BE_NUMBER',
  MAX_LENGTH = 'MAX_LENGTH',
  MIN_LENGTH = 'MIN_LENGTH',
  NOT_EMPTY = 'NOT_EMPTY',
  FORMAT_WRONG = 'FORMAT_WRONG',
  NOT_STRONG = 'NOT_STRONG',
  NOT_LOWERCASE = 'NOT_LOWERCASE',
  NOT_ALPHA_NUMERIC = 'NOT_ALPHA_NUMERIC',
}

export const getValidateMessage = (
  prefix: DtoPrefix,
  validation: DtoValidation,
  ...args: any[]
): string => {
  const msg: string = `${prefix}|${validation}${args.length > 0 ? '|' + args.join('|') : ''}`;

  return msg;
};
