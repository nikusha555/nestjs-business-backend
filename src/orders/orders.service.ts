import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity, OrderStatus } from './entity/order.entity';
import { Repository } from 'typeorm';
import { CartEntity, CartStatus } from 'src/cart/entity/cart.entity';
import { UserEntity } from 'src/auth/entity/user.entity';
import { OrderItemEntity } from './entity/order-item.entity';
import { InventoryService } from 'src/inventory/inventory.service';

/**
 * Handles order lifecycle:
 * cart checkout, order creation and inventory reservation.
 */
@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrderEntity)
        private orderRepo: Repository<OrderEntity>,

        @InjectRepository(OrderItemEntity)
        private orderItemRepo: Repository<OrderItemEntity>,

        @InjectRepository(CartEntity)
        private cartRepo: Repository<CartEntity>,

        private readonly inventoryService: InventoryService,
    ) { }

    /**
 * Checkout flow:
 * - validates active cart
 * - creates immutable order snapshot
 * - reserves inventory stock
 * - closes cart to prevent reuse
 */
    async checkout(user: UserEntity) {

        // Find active cart for current user
        const cart = await this.cartRepo.findOne({
            where: {
                user: { id: user.id },
                status: CartStatus.ACTIVE,
            },
            relations: ['items', 'items.product'],
        });

        if (!cart || cart.items.length === 0) {
            throw new BadRequestException('No active cart found or cart is empty');
        }

        // Calculate total price and create order item snapshots
        let total = 0;

        const orderItems = cart.items.map(item => {
            total += item.product.price * item.quantity;

            return this.orderItemRepo.create({
                productId: item.product.id,
                productTitle: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
            });
        });

        // Create order with immutable product data
        const order = this.orderRepo.create({
            user,
            status: OrderStatus.PENDING,
            total,
            items: orderItems,
        });


        await this.orderRepo.save(order);

        // Reserve inventory stock to prevent overselling during payment
        for (const item of order.items) {
            await this.inventoryService.reserve(
                item.productId,
                item.quantity,
            );
        }

        // Close cart after successful checkout
        cart.status = CartStatus.CHECKED_OUT;
        await this.cartRepo.save(cart);

        return order;

    }

/**
 * Returns authenticated user's orders with calculated item subtotals.
 */
    async getMyOrders(user: UserEntity) {
        const orders = await this.orderRepo.find({
            where: {
                user: { id: user.id },
            },
            relations: ['items'],
            order: {
                createdAt: 'DESC',
            },
        });

        return orders.map(order => ({
            id: order.id,
            status: order.status,
            total: order.total,
            createdAt: order.createdAt,
            items: order.items.map(item => ({
                productId: item.productId,
                productTitle: item.productTitle,
                price: item.price,
                quantity: item.quantity,
                subtotal: item.price * item.quantity,
            })),
        }));
    }

}

