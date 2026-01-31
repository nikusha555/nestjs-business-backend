import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from './email/email.service';
import { DailyEmailService } from './daily-email/daily-email.service';
import { ProductEntity } from 'src/products/entity/products.entity';
import { UserEntity } from 'src/auth/entity/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProductEntity,
            UserEntity,
        ]),
    ],
    providers: [
        EmailService,
        DailyEmailService,
    ],
    exports: [
        EmailService, // სხვებს თუ დასჭირდებათ
    ],
})
export class CommonModule { }
