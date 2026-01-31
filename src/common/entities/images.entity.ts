// src/common/entities/images.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { NewsStructure } from '../../news/entity/news.entity';

@Entity('images')
export class ImageStructure {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: string;

    @Column({ default: 0 })
    size: number;

    @Column({ default: 'image/jpeg' })
    mime_type: string;

    @Column({ default: 'News Image' })
    alt_text: string;

    @ManyToOne(() => NewsStructure, (news) => news.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'news_id' })
    news: NewsStructure;
}
