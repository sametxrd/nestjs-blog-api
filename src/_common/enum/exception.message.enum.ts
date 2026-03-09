export enum ExceptionPrefix {
  USER = 'USER',
  EMAIL = 'EMAIL',
  PASSWORD = 'PASSWORD',
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  TOKEN = 'TOKEN',
  BLOG = 'BLOG',
  BLOG_PHOTOS = 'BLOG_PHOTOS',
  COMMENT = 'COMMENT',
}

export enum ExceptionMessage {
  ALREADY_HAVE_ACC = 'ALREADY_HAVE_ACC',
  NOT_FOUND_ACC = 'NOT_FOUND_ACC',
  WRONG = 'WRONG',
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_HAVE = 'ALREADY_HAVE',
  NOT_OWNER = 'NOT_OWNER',
  LIMITED = 'LIMITED',
}

export const getExceptionMessage = (
  prefix: ExceptionPrefix,
  message: ExceptionMessage,
): string => {
  const msg: string = `${prefix}|${message}`;

  return msg;
};
