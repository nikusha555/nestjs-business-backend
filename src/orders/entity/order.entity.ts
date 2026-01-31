import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    Column,
    CreateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/auth/entity/user.entity';
import { OrderItemEntity } from './order-item.entity';

export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
}

@Entity('orders')
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity)
    user: UserEntity;

    @OneToMany(() => OrderItemEntity, item => item.order, {
        cascade: true,
    })
    items: OrderItemEntity[];

    @Column({ type: 'enum', enum: OrderStatus })
    status: OrderStatus;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @CreateDateColumn()
    createdAt: Date;
}
