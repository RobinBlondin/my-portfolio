import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import adminRouter from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';
import indexRoutes from './routes/indexRoutes';
import { initializeDatabase, startServer } from './utilities';

export const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());   
app.use('/admin', adminRouter); 
app.use('/' , authRoutes);
app.use('/', indexRoutes);

startServer(app);
initializeDatabase();

