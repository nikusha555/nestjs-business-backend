import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from './entity/products.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CurrencyService } from 'src/currency/currency/currency.service';
import { ProductsGateway } from './products.gateway';
import { EmailService } from 'src/common/email/email.service';
import { Like } from 'typeorm';
import { InventoryService } from 'src/inventory/inventory.service';
import { UserEntity } from 'src/auth/entity/user.entity';



@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductEntity)
        private productRepository: Repository<ProductEntity>,

        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,

        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,

        private readonly http: HttpService,
        private readonly currencyService: CurrencyService,
        private readonly productsGateway: ProductsGateway,
        private readonly emailService: EmailService,
        private readonly inventoryService: InventoryService,
    ) { }

    async findAll(): Promise<ProductEntity[]> {
        return this.productRepository.find({
            order: { created_at: 'DESC' },
            // relations: ['images'], // load images automatically
        });
    }

    async findOne(id: number): Promise<ProductEntity> {
        const oneProduct = await this.productRepository.findOne({
            where: { id },
            // relations: ['images'], // load images automatically
        });
        if (!oneProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return oneProduct;
    }

    async findByCategory(categoryId: number): Promise<ProductEntity[]> {
        const categoryProducts = await this.productRepository.find({
            where: { category: { id: categoryId } },
            // relations: ['images'], // load images automatically
        });
        if (!categoryProducts) {
            throw new NotFoundException(`Product with ID ${categoryId} not found`);
        }
        return categoryProducts;
    }
 

    async getAllUserEmails(): Promise<string[]> {
        const users = await this.userRepository.find({
            select: ['email'], // efficient query
        });

        return users
            .map(user => user.email)
            .filter(email => !!email); // remove null/undefined
    }


    // პროდუქტის დამატება

    async createProduct(dto: CreateProductDto) {
        const category = await this.categoryRepository.findOne({
            where: { id: dto.categoryId },
        });

        if (!category) throw new NotFoundException('Category not found');

        const product = this.productRepository.create({
            title: dto.title,
            description: dto.description,
            price: dto.price,
            category,
            emailSent: false,
        });

        const savedProduct = await this.productRepository.save(product);

        // 👇 quantity goes to INVENTORY
        await this.inventoryService.createForProduct(
            savedProduct,
            dto.quantity,
        );

        // 👇 GET ALL USER EMAILS
        const emails = await this.getAllUserEmails();

       

        // 👇 WebSocket notification
        this.productsGateway.notifyNewProduct(savedProduct);

        return savedProduct;
    }



    // პროდუქტის განახლება

    async updateProduct(id: number, dto: UpdateProductDto) {
        const product = await this.productRepository.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (dto.categoryId) {
            const category = await this.categoryRepository.findOne({ where: { id: dto.categoryId } });
            if (!category) throw new NotFoundException('Category not found');
            product.category = category;
        }

        Object.assign(product, dto);

        return this.productRepository.save(product);
    }




    async filterProducts(minPrice?: number, maxPrice?: number, currency?: string) {
        const qb = this.productRepository.createQueryBuilder('product');

        if (minPrice) qb.andWhere('product.price >= :minPrice', { minPrice });
        if (maxPrice) qb.andWhere('product.price <= :maxPrice', { maxPrice });

        const products = await qb.getMany();

        // If no currency provided → return normal products
        if (!currency) return products;

        // Get real-time exchange rate
        const rate = await this.getRate(currency);

        // Convert each product price
        return products.map(p => ({
            ...p,
            price_converted: +(p.price * rate).toFixed(2),
            currency: currency.toUpperCase(),
            rate_used: rate,
        }));
    }



    async getRate(targetCurrency: string): Promise<number> {
        // Always convert from GEL (lari)
        const url = `https://api.exchangerate.host/latest?base=GEL&symbols=${targetCurrency.toUpperCase()}`;

        const response = await firstValueFrom(this.http.get(url));

        const rate = response.data.rates[targetCurrency.toUpperCase()];

        if (!rate) {
            throw new Error('Currency not supported');
        }

        return rate;
    }



    async search(keyword: string) {
        if (!keyword) return [];

        return await this.productRepository.find({
            where: {
                title: Like(`%${keyword}%`)
            }
        });
    }


}