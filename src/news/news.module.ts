import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsStructure } from './entity/news.entity';
import { ImageStructure } from 'src/common/entities/images.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NewsStructure, ImageStructure])],
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
