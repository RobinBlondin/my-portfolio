import express from 'express';
import { link } from 'fs';
import path from 'path';

const app = express();

app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    const presention = {
        image: '/dist/img/profile.jpg',
        name: 'Robin Blondin',
        description: 'I am Robin Wass Blondin and I am an aspiring student of programming and web development with a main focus in the backend. My motto in life is to always be open to learn and try new things, which I think is a perfect match with a new career as a developer.'
    }

    const project1 = { 
        name: 'Project 1', 
        image: '/dist/img/password_manager.png', 
        link: 'https://github.com/RobinBlondin/password_manager',
    };

    const projects = [project1]
    console.log(projects);
    res.render('index', { title: 'My Portfolio', projects: projects, presentation: presention });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
