import { UserRole } from '../enum/user.enum';

export interface JWTpayload {
  id: number;
  global_username: string;
  user_role: UserRole;
}
