import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../entities/User';
import jwt from 'jsonwebtoken';
import { AppDatasource } from '../datasource';

const SECRET_KEY = process.env.SECRET_KEY;
const userRepo = AppDatasource.getRepository(User);

export const login = async (req: Request): Promise<string> => {
    const { name, password } = req.body;
    const user = await userRepo.findOneBy({ name: name });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    if (!SECRET_KEY) {
        throw new Error('Internal server error');
    }

    const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY, { expiresIn: '1h' });

    return token
};