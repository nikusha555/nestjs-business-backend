import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post('checkout')
    async checkout(@Req() req) {
        return this.ordersService.checkout(req.user);
    }

    @Get('my')
    async getMyOrders(@Req() req) {
        return this.ordersService.getMyOrders(req.user);
    }

}

