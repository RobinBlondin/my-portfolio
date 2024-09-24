import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('skills')
export class Skill {
    @PrimaryGeneratedColumn()
    id: number | null = null;

    @Column({ type: 'text'})
    name: string;

    @Column({ type: 'text'})
    imageUrl: string

    constructor(name: string, imageUrl: string) {
        this.name = name;
        this.imageUrl = imageUrl;
    }
}