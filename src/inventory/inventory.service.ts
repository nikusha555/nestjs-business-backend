import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryStructure } from './entity/inventory.entity';
import { ProductEntity } from 'src/products/entity/products.entity';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(InventoryStructure)
        private readonly inventoryRepo: Repository<InventoryStructure>,
    ) { }

    async createForProduct(product: ProductEntity, quantity: number) {
        const qty = Number(quantity);

        if (Number.isNaN(qty)) {
            throw new BadRequestException('Invalid quantity');
        }

        const inventory = this.inventoryRepo.create({
            product,
            quantity: qty,
            reserved: 0,
        });

        console.log('INVENTORY CREATE QTY:', qty, typeof qty);

        return this.inventoryRepo.save(inventory);
    }








    // Reserve a quantity of product in inventory

    async reserve(productId: number, qty: number) {
        const inventory = await this.inventoryRepo.findOne({
            where: { product: { id: productId } },
            relations: ['product'],
        });

        if (!inventory) {
            throw new NotFoundException('Inventory not found');
        }

        const available = inventory.quantity - inventory.reserved;

        if (available < qty) {
            throw new BadRequestException('Not enough stock');
        }

        inventory.reserved += qty;
        return this.inventoryRepo.save(inventory);
    }





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


    async confirm(productId: number, qty: number) {
        const inventory = await this.getInventoryByProduct(productId);

        inventory.quantity -= qty;
        inventory.reserved -= qty;

        return this.inventoryRepo.save(inventory);
    }

    async cancel(productId: number, qty: number) {
        const inventory = await this.getInventoryByProduct(productId);

        inventory.reserved -= qty;

        return this.inventoryRepo.save(inventory);
    }




}