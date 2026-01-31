import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    Column,
} from 'typeorm';
import { UserEntity } from 'src/auth/entity/user.entity';
import { CartItemEntity } from './cart-item.entity';

export enum CartStatus {
    ACTIVE = 'ACTIVE',
    CHECKED_OUT = 'CHECKED_OUT',
}

@Entity('carts')
export class CartEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.carts)
    user: UserEntity;

    @OneToMany(() => CartItemEntity, item => item.cart, { cascade: true })
    items: CartItemEntity[];

    @Column({ type: 'enum', enum: CartStatus, default: CartStatus.ACTIVE })
    status: CartStatus;

    @CreateDateColumn()
    createdAt: Date;
}
