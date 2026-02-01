import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryStructure } from './entity/inventory.entity';
import { ProductEntity } from 'src/products/entity/products.entity';

/**
 * Manages product inventory lifecycle:
 * stock initialization, reservation and final confirmation.
 */
@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(InventoryStructure)
        private readonly inventoryRepo: Repository<InventoryStructure>,
    ) { }

    /**
 * Initializes inventory record for newly created product.
 */
    async createForProduct(product: ProductEntity, quantity: number) {

        // Ensure quantity is valid number
        const qty = Number(quantity);

        if (Number.isNaN(qty)) {
            throw new BadRequestException('Invalid quantity');
        }
        // Create initial inventory state
        const inventory = this.inventoryRepo.create({
            product,
            quantity: qty,
            reserved: 0,
        });



        return this.inventoryRepo.save(inventory);
    }







    /**
     * Reserves inventory stock during checkout process
     * to prevent overselling.
     */
    async reserve(productId: number, qty: number) {
        const inventory = await this.inventoryRepo.findOne({
            where: { product: { id: productId } },
            relations: ['product'],
        });

        if (!inventory) {
            throw new NotFoundException('Inventory not found');
        }
        // Calculate available stock excluding reserved quantity
        const available = inventory.quantity - inventory.reserved;

        if (available < qty) {
            throw new BadRequestException('Not enough stock');
        }
        // Increase reserved quantity temporarily
        inventory.reserved += qty;
        return this.inventoryRepo.save(inventory);
    }




    /**
     * Returns inventory record for given product.
     */
    async getInventoryByProduct(productId: number): Promise<InventoryStructure> {
        const inventory = await this.inventoryRepo.findOne({
            where: { product: { id: productId } },
            relations: ['product'],
        });

        if (!inventory) {
            throw new NotFoundException('Inventory not found');
        }

        return inventory;
    }

    /**
     * Confirms inventory after successful payment.
     * Reduces actual stock and clears reserved quantity.
     */
    async confirm(productId: number, qty: number) {
        const inventory = await this.getInventoryByProduct(productId);
        // Final stock mutation after payment success
        inventory.quantity -= qty;
        inventory.reserved -= qty;

        return this.inventoryRepo.save(inventory);
    }

    /**
 * Cancels inventory reservation when payment fails.
 */
    async cancel(productId: number, qty: number) {
        const inventory = await this.getInventoryByProduct(productId);
        // Release previously reserved stock
        inventory.reserved -= qty;

        return this.inventoryRepo.save(inventory);
    }




}