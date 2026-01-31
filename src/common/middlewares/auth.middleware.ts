import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'src/auth/constants';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        try {
            // 1️⃣ Get token from header
            const authHeader = req.headers['authorization'];

            if (!authHeader) {
                throw new UnauthorizedException('Token missing');
            }

            // 2️⃣ Check if it starts with "Bearer"
            const token = authHeader.split(' ')[1];
            if (!token) {
                throw new UnauthorizedException('Invalid token format');
            }

            // 3️⃣ Verify token 
        
            const decoded = jwt.verify(token, JWT_SECRET);

            // 4️⃣ Store decoded data in request (so controllers can use it)
            req['user'] = decoded;

            // 5️⃣ Continue to next handler (controller)
            next();
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
