// src/news/entity/news.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { ImageStructure } from '../../common/entities/images.entity';

@Entity('news')
export class NewsStructure {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    mini_title: string;

    @Column('text')
    content: string;

    @OneToMany(() => ImageStructure, (image) => image.news, { cascade: true , eager: true})
    images: ImageStructure[];

    
    @CreateDateColumn()
    created_at: Date;
}
