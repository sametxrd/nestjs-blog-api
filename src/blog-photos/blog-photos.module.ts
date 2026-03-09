import { forwardRef, Module } from '@nestjs/common';
import { BlogPhotosController } from './blog-photos.controller';
import { BlogPhotosService } from './blog-photos.service';
import { BlogsModule } from 'src/blogs/blogs.module';
import { BlogPhoto } from 'src/_common/typeorm/blog.photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTconfig } from 'src/_common/config';
import { JwtModule } from '@nestjs/jwt';
import { Blog } from 'src/_common/typeorm/blog.entity';

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
    TypeOrmModule.forFeature([BlogPhoto, Blog]),
    forwardRef(() => BlogsModule),
  ],
  controllers: [BlogPhotosController],
  providers: [BlogPhotosService],
})
export class BlogPhotosModule {}
