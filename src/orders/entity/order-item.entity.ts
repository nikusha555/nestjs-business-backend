import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
} from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('order_items')
export class OrderItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => OrderEntity, order => order.items, {
        onDelete: 'CASCADE',
    })
    order: OrderEntity;

    @Column()
    productId: number;

    @Column()
    productTitle: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column()
    quantity: number;
}
