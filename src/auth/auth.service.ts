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

    /**
   * Validates user credentials.
   * Returns user entity if credentials are correct.
   */
    async validateUser(username: string, password: string): Promise<UserEntity | null> {
        const user = await this.userRepository.findOne({ where: { username } });

        // Simple password comparison (no hashing for this project yet)
        if (user && user.password === password) {
            return user;
        }

        return null;
    }

    /**
      * Handles user login and JWT token generation.
      */
    async login(username: string, password: string) {
        const user = await this.validateUser(username, password);

        if (!user) {
            return { message: 'Invalid credentials' };
        }


        const payload = {
            id: user.id,
            username: user.username,
        };

        // Generate short-lived JWT token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });


        return {
            message: 'Login successful',
            token,
        };
    }
}
