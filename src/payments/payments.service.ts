import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderEntity, OrderStatus } from 'src/orders/entity/order.entity';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entity/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { stripe } from './stripe.service';
import { InventoryService } from 'src/inventory/inventory.service';
import { DataSource } from 'typeorm';



@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(OrderEntity)
        private orderRepo: Repository<OrderEntity>,

        @InjectRepository(Payment)
        private paymentRepo: Repository<Payment>,

        private readonly inventoryService: InventoryService,
        private readonly dataSource: DataSource,
    ) { }

    async createPayment(orderId: number) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
        });

        if (!order || order.status !== OrderStatus.PENDING) {
            throw new BadRequestException('Order not payable');
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.total * 100), // cents
            currency: 'usd',
            metadata: {
                orderId: order.id.toString(),
            },
        });

        const payment = this.paymentRepo.create({
            order,
            provider: 'stripe',
            providerPaymentId: paymentIntent.id,
            status: PaymentStatus.PENDING,
        });

        await this.paymentRepo.save(payment);

        return {
            clientSecret: paymentIntent.client_secret,
        };
    }


    async confirmPayment(providerPaymentId: string, orderId: number) {
        return this.dataSource.transaction(async (manager) => {
            const payment = await manager.findOne(Payment, {
                where: { providerPaymentId },
                relations: ['order', 'order.items'],
            });

            if (!payment) {
                throw new NotFoundException('Payment not found');
            }

            if (payment.status === PaymentStatus.SUCCESS) {
                return payment;
            }

            if (payment.order.id !== orderId) {
                throw new BadRequestException('Order mismatch');
            }

            // 🔥 inventory confirm (atomic)
            for (const item of payment.order.items) {
                await this.inventoryService.confirm(
                    item.productId,
                    item.quantity,
                );
            }

            payment.status = PaymentStatus.SUCCESS;
            payment.order.status = OrderStatus.PAID;

            await manager.save(payment);
            await manager.save(payment.order);

            return payment;
        });
    }


}

