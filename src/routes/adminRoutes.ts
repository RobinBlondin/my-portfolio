import router, { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middlewares/authMiddleWare';
import { setUploadsStorage, setPathOfFile } from '../utilities';
import { Presentation } from '../entities/Presentation';
import { Project } from '../entities/Project';
import { Skill } from '../entities/Skill';
import { presentationRepo, projectRepo, skillRepo } from '../repositories';
import { RedirectError } from '../errors/RedirectError';

const adminRouter = router();
const upload = setUploadsStorage();

adminRouter.get('/', authMiddleware, (req, res) => {
    res.render('admin', { title: 'Admin' });
});

adminRouter.get('/presentation', authMiddleware, (req, res) => {
    const errorMessage = req.query.error || null;
    const successMessage = req.query.success || null;
    res.render('presentation', { title: 'Edit presentation', errorMessage, successMessage });
});

adminRouter.get('/project', authMiddleware, (req, res) => {
    const errorMessage = req.query.error || null;
    const successMessage = req.query.success || null;
    res.render('project', { title: 'Add projects', errorMessage, successMessage });
});

adminRouter.get('/skill', authMiddleware, (req, res) => {
    const errorMessage = req.query.error || null;
    const successMessage = req.query.success || null;
    res.render('skill', { title: 'Add skills', errorMessage, successMessage });
});

adminRouter.post('/presentation', authMiddleware, upload.single('image'), async (req, res, next) => {
    try {
    const { name, description } = req.body;
    const file = req.file;

    if (!name.trim() || !description.trim() || !file) {
        return next(new RedirectError('Missing input fields', 400, '/admin/presentation?error=Missing input fields'));
    }

    const imageUrl = setPathOfFile(file);
    const presentations = await presentationRepo.findBy({ name: "Robin Blondin" });
    const presentation = new Presentation(name, imageUrl, description);

    if (presentations.length > 0) {
        presentation.id = presentations[0].id;
    }

    await presentationRepo.save(presentation);

    res.redirect('/admin?success=Presentation updated');
    } catch (error) {
        next(error);
    }
});

adminRouter.post('/project', authMiddleware, upload.single('image'), async (req, res, next: NextFunction) => {
    try {
        const { name, link } = req.body;
        const file = req.file;

        if (!name.trim() || !link.trim() || !file) {
            return next(new RedirectError('Missing input fields', 400, '/admin/project?error=Missing input fields'));
        }

        if (isInvalidLink(link)) {
            return next(new RedirectError('Invalid link format', 400, '/admin/project?error=Invalid link format'));
        }

        const imageUrl = setPathOfFile(file);
        const project = new Project(name, imageUrl, link);

        await projectRepo.save(project);
        res.redirect('/admin/project?success=Project added');
    } catch (error) {
        next(error);
    }
});

adminRouter.post('/skill', authMiddleware, upload.single('image'), async (req, res, next) => {
    try {
        const name = req.body.name;
        const file = req.file

        if (!name || !file) {
            return next(new RedirectError('Mislsosing input fields', 400, '/admin/skill?error=Missing input fields'));
        }

        const skills = await skillRepo.findOneBy({ name: name });

        if (skills) {
            return next(new RedirectError('Skill already exists', 400, '/admin/skill?error=Skill already exists'));
            
        }

        const imageUrl = setPathOfFile(file);
        const skill = new Skill(name, imageUrl);
        await skillRepo.save(skill);

        res.redirect('/admin/skill?success=Skill added');
    } catch (error) {
        next(error);
    }
});

function isInvalidLink(link: string) {
    return !link.match(/^(http|https):\/\/[^ "]+$/) ? true : false;
}

adminRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    if (err instanceof RedirectError) {
        return res.redirect(err.redirectUrl);
    }
    next(err);
});

export default adminRouter;