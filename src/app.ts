import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import multer from 'multer';
import { AppDatasource } from './datasource';
import { User } from './entities/User';
import { Project } from './entities/Project';
import { Presentation } from './entities/Presentation';
import { Skill } from './entities/Skill';
import { startServer, initializeDatabase, addAdminUser, setUploadsStorage, setPathOfFile } from './utilities';
import { generateMockPresentation, generateMockProject, generateMockSkill } from './mockdata';
import { login } from './controllers/authController';
import { authMiddleware } from './middlewares/authMiddleWare';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());    


const userRepo = AppDatasource.getRepository(User);
const projectRepo = AppDatasource.getRepository(Project);
const presentationRepo = AppDatasource.getRepository(Presentation);
const skillRepo = AppDatasource.getRepository(Skill);

const upload = multer({ storage: setUploadsStorage() });

// Routes
app.get('/', async (req, res) => {
    const presentations = await presentationRepo.findBy({name: "Robin Blondin"});
    
    let presentation;
    if(presentations.length > 0) {
        presentation = presentations[0];
    } else {
        presentation = generateMockPresentation();
    }

    const skills = (await skillRepo.find()).length === 0 ? generateMockSkill() : await skillRepo.find();
    const projects = (await projectRepo.find()).length === 0 ? generateMockProject() : await projectRepo.find();

    res.render('index', { title: 'My Portfolio', projects: projects, presentation: presentation, skills: skills });
});

app.get('/login', (req, res) => {
    const errorMessage = req.query.error || null;
    res.render('login', { title: 'Login', errorMessage });
});

app.get('/admin', authMiddleware, (req, res) => {
    res.render('admin', { title: 'Admin' });
});

app.get('/admin/presentation', authMiddleware, (req, res) => {
    res.render('presentation', { title: 'Edit presentation' });
});

app.get('/admin/project', authMiddleware, (req, res) => {
    
    res.render('project', { title: 'Add projects' });
});

app.get('/admin/skill', authMiddleware, (req, res, next) => {
    res.render('skill', { title: 'Add skills' });
});

app.post('/login', async (req, res) => {
    try {
        const token = await login(req);
        
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict' 
        });

        res.redirect('/admin');
    } catch (error) {
        const errorMessage = encodeURIComponent((error as Error).message);
        res.redirect(`/login?error=${errorMessage}`);
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});


app.post('/admin/edit-presentation', authMiddleware, upload.single('image'), async (req, res) => {
    const { name, description} = req.body;
    const imageUrl = setPathOfFile(req);
    const presentations = await presentationRepo.findBy({name: "Robin Blondin"});
    const presentation = new Presentation(name, imageUrl, description);

    if(presentations.length > 0) {
        presentation.id = presentations[0].id;
    }

    presentationRepo.save(presentation);

    res.redirect('/admin');
});

app.post('/admin/add-project', authMiddleware, upload.single('image'), async (req, res) => {
    const { name, link} = req.body;
    const imageUrl = setPathOfFile(req);
    const project = new Project(name, imageUrl, link);

    await projectRepo.save(project);
    res.redirect('/admin');
});

app.post('/admin/add-skill', authMiddleware, upload.single('image'), async (req, res) => {
    const name = req.body.name;
    const imageUrl = setPathOfFile(req);
    const skill = new Skill(name, imageUrl);

    const skills = await skillRepo.findBy({name: name});
    if(skills.length === 0) {
        await skillRepo.save(skill);
    }

    res.redirect('/admin');
});

// End of routes

startServer(app)
initializeDatabase();


