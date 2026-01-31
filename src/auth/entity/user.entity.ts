import { CartEntity } from 'src/cart/entity/cart.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToMany(() => CartEntity, cart => cart.user)
    carts: CartEntity[];

    @CreateDateColumn()
    created_at: Date;
}