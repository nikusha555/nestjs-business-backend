// src/news/news.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { NewsStructure } from './entity/news.entity';
import { ImageStructure } from '../common/entities/images.entity';
import { newsDto } from './dto/news.dto';

/**
 * Manages news content and related images.
 */
@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(NewsStructure)
        private newsRepository: Repository<NewsStructure>,
    ) { }


    /**
     * Returns all news ordered by creation date.
     */
    async findAll(): Promise<NewsStructure[]> {
        return this.newsRepository.find({
            order: { created_at: 'DESC' },
            relations: ['images'],
        });
    }

    /**
 * Returns single news item by ID.
 */
    async findOne(id: number): Promise<NewsStructure> {
        const oneNews = await this.newsRepository.findOne({
            where: { id },
            relations: ['images'],
        });
        if (!oneNews) {
            throw new NotFoundException(`News with ID ${id} not found`);
        }
        return oneNews;
    }

    /**
 * Creates news entry with optional image attachments.
 */
    async createNews(createNewsDto: newsDto): Promise<NewsStructure> {
        const { title, mini_title, content, images } = createNewsDto;
        const news = this.newsRepository.create({
            title,
            mini_title,
            content,
            // Map image DTOs to Image entities
            images: images?.map((img) =>
                Object.assign(new ImageStructure(), {
                    path: img.path,
                    size: img.size ?? 0,
                    mime_type: img.mime_type || 'image/jpeg',
                    alt_text: img.alt_text || 'News Image',
                }),
            ),
        });

        return this.newsRepository.save(news);
    }

    /**
 * Updates existing news entry and replaces images if provided.
 */
    async editNews(id: number, updateNewsDto: newsDto): Promise<NewsStructure> {
        const news = await this.findOne(id);
        if (!news) {
            throw new NotFoundException(`News with ID ${id} not found`);
        }
        const { title, mini_title, content, images } = updateNewsDto;
        news.title = title ?? news.title;
        news.mini_title = mini_title ?? news.mini_title;
        news.content = content ?? news.content;
        // Replace images only if new ones are provided
        if (images) {
            news.images = images.map((img) =>
                Object.assign(new ImageStructure(), {
                    path: img.path,
                    size: img.size ?? 0,
                    mime_type: img.mime_type || 'image/jpeg',
                    alt_text: img.alt_text || 'News Image',

                }),
            );
        }

        return this.newsRepository.save(news);
    }

    /**
     * Deletes news entry by ID.
     */
    async remove(id: number): Promise<void> {
        const result = await this.newsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`News with ID ${id} not found`);
        }

    }

}