import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from "typeorm";
import { User } from './entities/User';
import { Project } from './entities/Project';
import { Presentation } from './entities/Presentation';
import { Skill } from './entities/Skill';

const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined;

export const AppDatasource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: port,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    
    entities: [
        User, Project, Presentation, Skill
    ],

    synchronize: true,
    logging: true,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});