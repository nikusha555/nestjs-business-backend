import { Body, Controller, Get, Post, Patch, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { CurrencyService } from 'src/currency/currency/currency.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService, private readonly currencyService: CurrencyService) { }

    @Get()
    async getAllProducts() {
        const products = await this.productsService.findAll();

        // get rate once
        const rate = await this.currencyService.getRate('USD');

        return products.map(product => ({
            ...product,
            price_usd: +(product.price * rate).toFixed(2),
        }));
    }


    @Get('filter')
    async filterProducts(
        @Query('minPrice') minPrice?: number,
        @Query('maxPrice') maxPrice?: number,
    ) {
        return this.productsService.filterProducts(minPrice, maxPrice);
    }

    @Get('search')
    async searchProducts(@Query('keyword') keyword: string) {
        return this.productsService.search(keyword);
    }


    @Get('/:categoryId')
    async getProductsByCategory(@Param('categoryId') categoryId: number) {
        return this.productsService.findByCategory(categoryId);
    }

    @Get(':id')
    async getProduct(@Param('id') id: number) {
        const product = await this.productsService.findOne(id);

        const priceUsd = await this.currencyService.convertGelToUsd(product.price);

        return {
            ...product,
            price_usd: priceUsd,
        };
    }




    @UseGuards(AuthGuard('jwt'))
    @Post('')
    create(@Body() dto: CreateProductDto) {
        return this.productsService.createProduct(dto);
    }

    @Patch('/:id')
    update(
        @Param('id') id: number,
        @Body() dto: UpdateProductDto
    ) {
        return this.productsService.updateProduct(id, dto);
    }





}