import {
    Controller,
    Get,
    UseGuards,
    Req,
    Post,
    Body,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post('add')
    async addToCart(
        @Req() req,
        @Body('productId') productId: number,
    ) {
        return this.cartService.addToCart(req.user, productId);
    }

    @Get('my')
    async getMyCart(@Req() req) {
        return this.cartService.getMyCart(req.user);
    }
}
