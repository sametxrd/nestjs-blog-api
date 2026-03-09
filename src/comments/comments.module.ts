import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Blog } from 'src/_common/typeorm/blog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTconfig } from 'src/_common/config';
import { JwtModule } from '@nestjs/jwt';
import { Comment } from 'src/_common/typeorm/comment.entity';

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
    TypeOrmModule.forFeature([Comment, Blog]),
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
