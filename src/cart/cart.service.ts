import { Injectable, NotFoundException } from '@nestjs/common';
import { CartEntity, CartStatus } from './entity/cart.entity';
import { CartItemEntity } from './entity/cart-item.entity';
import { Repository } from 'typeorm';
import { ProductEntity } from 'src/products/entity/products.entity';
import { UserEntity } from 'src/auth/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartEntity)
        private cartRepo: Repository<CartEntity>,

        @InjectRepository(CartItemEntity)
        private cartItemRepo: Repository<CartItemEntity>,

        @InjectRepository(ProductEntity)
        private productRepo: Repository<ProductEntity>,
    ) { }

    async addToCart(user: UserEntity, productId: number) {
        // 1. პროდუქტის არსებობის შემოწმება
        const product = await this.productRepo.findOne({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // 2. ACTIVE cart-ის პოვნა
        let cart = await this.cartRepo.findOne({
            where: {
                user: { id: user.id },
                status: CartStatus.ACTIVE,
            },
            relations: ['items', 'items.product'],
        });

        // 3. თუ cart არ არსებობს – შევქმნათ
        if (!cart) {
            cart = this.cartRepo.create({
                user,
                status: CartStatus.ACTIVE,
                items: [],
            });

            await this.cartRepo.save(cart);
        }

        // 4. ვეძებთ cartItem-ს
        let cartItem = cart.items.find(
            item => item.product.id === product.id,
        );

        // 5. თუ არსებობს – quantity++
        if (cartItem) {
            cartItem.quantity += 1;
            await this.cartItemRepo.save(cartItem);
        } else {
            // 6. თუ არ არსებობს – ვქმნით ახალს
            cartItem = this.cartItemRepo.create({
                cart,
                product,
                quantity: 1,
            });

            await this.cartItemRepo.save(cartItem);
        }

        return cart;
    }


    async getMyCart(user: UserEntity) {
        const cart = await this.cartRepo.findOne({
            where: {
                user: { id: user.id },
                status: CartStatus.ACTIVE,
            },
            relations: [
                'items',
                'items.product',
            ],
        });

        if (!cart) {
            return {
                items: [],
                total: 0,
            };
        }

        const total = cart.items.reduce((sum, item) => {
            return sum + item.product.price * item.quantity;
        }, 0);

        return {
            id: cart.id,
            items: cart.items.map(item => ({
                id: item.id,
                product: {
                    id: item.product.id,
                    title: item.product.title,
                    price: item.product.price,
                },
                quantity: item.quantity,
                subtotal: item.product.price * item.quantity,
            })),
            total,
        };
    }

}

