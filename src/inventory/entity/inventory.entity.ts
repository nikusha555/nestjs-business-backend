import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { ProductEntity } from '../../products/entity/products.entity';

@Entity()
export class InventoryStructure {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => ProductEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    product: ProductEntity;

    @Column({ type: 'int', default: 0 })
    quantity: number;

    @Column({ type: 'int', default: 0 })
    reserved: number;
}
