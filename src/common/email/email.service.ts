import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nikushamitichashvili@gmail.com',
                pass: 'alqr tkxq xkgu tiom', // create an app password in Gmail
            },
        });
    }

    async sendEmail(to: string, subject: string, text: string) {
        await this.transporter.sendMail({
            from: 'nikushamitichashvili@gmail.com',
            to,
            subject,
            text,
        });
    }
}
