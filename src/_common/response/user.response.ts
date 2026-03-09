import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enum/user.enum';

export abstract class UserResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  display_username: string;
  @ApiProperty()
  global_username: string;
  @ApiProperty()
  avatar_url: string;
  @ApiProperty()
  user_role: UserRole;
}
