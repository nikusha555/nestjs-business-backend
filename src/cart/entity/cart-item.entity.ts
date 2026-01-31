import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { CartEntity } from './cart.entity';
import { ProductEntity } from 'src/products/entity/products.entity';

@Entity('cart_items')
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CartEntity, cart => cart.items, { onDelete: 'CASCADE' })
  cart: CartEntity;

  @ManyToOne(() => ProductEntity)
  product: ProductEntity;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
