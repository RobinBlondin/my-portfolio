import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number | null = null;

    @Column({ type: 'text'})
    name: string;

    @Column({ type: 'text'})
    password: string

    constructor(name: string, password: string) {
        this.name = name;
        this.password = password;
    }
}