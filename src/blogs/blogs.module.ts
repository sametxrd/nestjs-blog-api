import { forwardRef, Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from 'src/_common/typeorm/blog.entity';
import { BlogPhotosModule } from 'src/blog-photos/blog-photos.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTconfig } from 'src/_common/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [JWTconfig],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('jwt'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Blog]),
    forwardRef(() => BlogPhotosModule),
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
