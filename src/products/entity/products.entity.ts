// product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';



@Entity('products')
export class ProductEntity { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2
    })
    price: number;


    @ManyToOne(() => Category, category => category.products, { eager: true })
    @JoinColumn({ name: 'category_id' })
    category: Category;


    @Column({ default: false })
    emailSent: boolean;


    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
