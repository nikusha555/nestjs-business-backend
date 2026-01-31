import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductEntity } from './entity/products.entity';
import { Category } from './entity/category.entity';
import { UserEntity } from 'src/auth/entity/user.entity';
import { HttpModule } from '@nestjs/axios';
import { CurrencyService } from 'src/currency/currency/currency.service';
import { ProductsGateway } from './products.gateway';
import { EmailService } from 'src/common/email/email.service';
import { InventoryModule } from 'src/inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        ProductEntity,
      Category,
      UserEntity, 
    ]),
    HttpModule,
    InventoryModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsGateway,
    CurrencyService,
    EmailService,
  ],
})
export class ProductsModule { }
