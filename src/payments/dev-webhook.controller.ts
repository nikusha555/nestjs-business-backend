import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('dev/webhooks')
export class DevWebhookController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('stripe/success')
  async simulateStripeSuccess(
    @Body('providerPaymentId') providerPaymentId: string,
    @Body('orderId') orderId: number,
  ) {
    await this.paymentsService.confirmPayment(
      providerPaymentId,
      orderId,
    );

    return { simulated: true };
  }
}
