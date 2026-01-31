import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { OrderEntity } from 'src/orders/entity/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { DevWebhookController } from './dev-webhook.controller';
import { StripeWebhookController } from './stripe-webhook.controller';
import { InventoryModule } from 'src/inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      OrderEntity,
    ]),
    InventoryModule,
  ],
  controllers: [
    PaymentsController,
    StripeWebhookController,   // production (მოგვიანებით)
    DevWebhookController,      /// ⚠️ Dev-only webhook simulator (no Stripe CLI)

  ],
  providers: [PaymentsService],
})
export class PaymentsModule { }

