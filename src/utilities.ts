import { Express } from 'express';
import { AppDatasource } from "./datasource";
import { User } from "./entities/User";
import { Repository } from "typeorm";
import path from 'path';
import multer from 'multer';
import fs from 'fs';

const userRepo = AppDatasource.getRepository(User);


export function initializeDatabase() {
    AppDatasource.initialize()
        .then(() => {
            console.log('Database has been initialized');
            addAdminUser(userRepo);
        })
        .catch((error) => {
            console.error('Error initializing database', error);
        });
}

export async function addAdminUser(userRepo: Repository<User>) {
        const users = await userRepo.findBy({ name: 'admin' });
    
        let user;
        if(users.length === 0) {
            user = new User('admin', '$2y$10$i3jO4C6aAHhjhj6bWnuf3.1Q/c/x3HtiJDTHV18jO2QLEpGirzkpG');
            try {
                await userRepo.save(user);
                console.log('User saved');
            } catch (error) {
                console.error('Error saving user', error);
            }
        } else {
            console.log('User already exists');
        }    
}

export function startServer(app: Express) {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
    console.log(`Server is running`);
    });
}

export function setUploadsStorage() {
    const UPLOADS_DIR = path.join(__dirname, '..', 'uploads/');
    if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    return multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
}

export function setPathOfFile(req: any) {
    const fileName = req.file?.originalname;
    return `uploads/${fileName}`;
}