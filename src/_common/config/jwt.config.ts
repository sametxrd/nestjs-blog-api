import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  global: true,
  secret: process.env.JWT_SECRET_KEY,
  signOptions: { expiresIn: '30m' },
}));
