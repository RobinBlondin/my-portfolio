import  router  from 'express';
import { authMiddleware } from '../middlewares/authMiddleWare';
import { upload, setPathOfFile } from '../utilities';
import { Presentation } from '../entities/Presentation';
import { Project } from '../entities/Project';
import { Skill } from '../entities/Skill';
import { presentationRepo, projectRepo, skillRepo } from '../repositories';

const adminRouter = router();

adminRouter.get('/', authMiddleware, (req, res) => {
    res.render('admin', { title: 'Admin' });
});

adminRouter.get('/presentation', authMiddleware, (req, res) => {
    res.render('presentation', { title: 'Edit presentation' });
});

adminRouter.get('/project', authMiddleware, (req, res) => {
    
    res.render('project', { title: 'Add projects' });
});

adminRouter.get('/skill', authMiddleware, (req, res, next) => {
    res.render('skill', { title: 'Add skills' });
});

adminRouter.post('/edit-presentation', authMiddleware, upload.single('image'), async (req, res) => {
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

adminRouter.post('/add-project', authMiddleware, upload.single('image'), async (req, res) => {
    const { name, link} = req.body;
    const imageUrl = setPathOfFile(req);
    const project = new Project(name, imageUrl, link);

    await projectRepo.save(project);
    res.redirect('/admin');
});

adminRouter.post('/add-skill', authMiddleware, upload.single('image'), async (req, res) => {
    const name = req.body.name;
    const imageUrl = setPathOfFile(req);
    const skill = new Skill(name, imageUrl);
    const skills = await skillRepo.findBy({name: name});
    
    if(skills.length === 0) {
        await skillRepo.save(skill);
    }

    res.redirect('/admin');
});

export default adminRouter;