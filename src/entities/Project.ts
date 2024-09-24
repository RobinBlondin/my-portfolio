import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id: number | null = null;

    @Column({ type: 'text'})
    name: string;

    @Column({ type: 'text'})
    imageUrl: string

    @Column({ type: 'text'})
    link: string

    constructor(name: string, imageUrl: string, link: string) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.link = link;
    }
}