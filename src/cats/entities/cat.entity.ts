import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Breed } from '../../breeds/entities/breed.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Cat {
    // @Column({ primary: true, generated: true })
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    age: number;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => Breed, (breed) => breed.id, {
        eager: true
    } )
    breed: Breed;

    @ManyToOne(() => User, {
        createForeignKeyConstraints: false,
    })
    @JoinColumn({ name: 'userEmail', referencedColumnName: 'email' })
    user: User;

    @Column()
    userEmail: string;
}
