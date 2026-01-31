import {
    Controller,
    Post,
    Req,
    Headers,
    BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import Stripe from 'stripe';
import { stripe } from './stripe.service';
import { PaymentsService } from './payments.service';

@Controller('webhooks')
export class StripeWebhookController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('stripe')
    async handleStripeWebhook(
        @Req() req: Request,
        @Headers('stripe-signature') signature: string,
    ) {
        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!,
            );
        } catch (err) {
            throw new BadRequestException('Invalid Stripe signature');
        }

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;

            const orderId = paymentIntent.metadata.orderId;

            await this.paymentsService.confirmPayment(
                paymentIntent.id,
                Number(orderId),
            );
        }

        return { received: true };
    }
}
