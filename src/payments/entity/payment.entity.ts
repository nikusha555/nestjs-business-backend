import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
} from 'typeorm';
import { OrderEntity } from 'src/orders/entity/order.entity';

export enum PaymentStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => OrderEntity)
    order: OrderEntity;

    @Column()
    provider: string; // stripe, payze, tbc

    @Column()
    providerPaymentId: string;

    @Column({ type: 'enum', enum: PaymentStatus })
    status: PaymentStatus;

    @CreateDateColumn()
    createdAt: Date;
}
