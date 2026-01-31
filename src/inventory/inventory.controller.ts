import { Body, Controller, Param, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ParseIntPipe } from '@nestjs/common';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post(':productId/reserve')
    reserve(
        @Param('productId', ParseIntPipe) productId: number,
        @Body('qty') qty: number,
    ) {
        return this.inventoryService.reserve(productId, qty);
    }
}
