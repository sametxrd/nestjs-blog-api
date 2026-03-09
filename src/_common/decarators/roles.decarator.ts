import { Reflector } from '@nestjs/core';
import { UserRole } from '../enum/user.enum';

export const Roles = Reflector.createDecorator<UserRole[]>();
