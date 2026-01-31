import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from './constants';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    async validateUser(username: string, password: string): Promise<UserEntity | null> {
        const user = await this.userRepository.findOne({ where: { username } });

        if (user && user.password === password) {
            return user;
        }

        return null;
    }

    async login(username: string, password: string) {
        const user = await this.validateUser(username, password);

        if (!user) {
            return { message: 'Invalid credentials' };
        }

        // 1️⃣ Create a payload (data inside token)
        const payload = {
            id: user.id,
            username: user.username,
        };

        // 2️⃣ Sign the token (like creating a secret message)
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); 

        // 3️⃣ Return the token to frontend
        return {
            message: 'Login successful',
            token,
        };
    }
}
