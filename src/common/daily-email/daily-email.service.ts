import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from 'src/products/entity/products.entity';
import { EmailService } from 'src/common/email/email.service';
import { UserEntity } from 'src/auth/entity/user.entity';

@Injectable()
export class DailyEmailService {
    constructor(
        @InjectRepository(ProductEntity)
        private productRepo: Repository<ProductEntity>,

        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,

        private readonly emailService: EmailService,
    ) { }

    // ⏰ ყოველდღე 20:00-ზე
    @Cron('0 20 * * *')
    async sendDailyEmail() {
        const products = await this.productRepo.find({
            where: { emailSent: false },
        });

        if (!products.length) return;

        const list = products
            .map(p => `• ${p.title} — ${p.price}₾`)
            .join('\n');

        const message = `
დღეს დამატებული პროდუქტები:

${list}

მადლობა რომ ჩვენთან ხართ ❤️
    `;

        const users = await this.userRepo.find({
            select: ['email'],
        });

        const emails = users.map(u => u.email).filter(Boolean);

        await Promise.all(
            emails.map(email =>
                this.emailService.sendEmail(
                    email,
                    'დღის ახალი პროდუქტები',
                    message,
                ),
            ),
        );

        await this.productRepo.update(
            { emailSent: false },
            { emailSent: true },
        );
    }
}
