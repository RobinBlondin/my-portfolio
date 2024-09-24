import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('presentations')
export class Presentation {
    @PrimaryGeneratedColumn()
    id: number | null = null;

    @Column({ type: 'text'})
    name: string;

    @Column({ type: 'text'})
    imageUrl: string;

    @Column({ type: 'text'})
    description: string

    constructor(name: string, imageUrl: string, description: string) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.description = description;
    }
}