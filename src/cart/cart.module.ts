import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { UserEntity } from 'src/auth/entity/user.entity';
import { ProductEntity } from 'src/products/entity/products.entity';
import { CartItemEntity } from './entity/cart-item.entity';
import { CartEntity } from './entity/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartEntity,
      CartItemEntity,
      ProductEntity,
      UserEntity,
    ]),
  ],


  providers: [CartService],
  controllers: [CartController]
})
export class CartModule { }
