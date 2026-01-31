import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*', // allow all for testing
    },
})
@Injectable()
export class ProductsGateway {
    @WebSocketServer()
    server: Server;

    // Send notification to all connected clients
    notifyNewProduct(product: any) {
        this.server.emit('newProduct', product);
    }
}
