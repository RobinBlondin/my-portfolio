import router from 'express';
import { presentationRepo, projectRepo, skillRepo } from '../repositories';
import { generateMockPresentation, generateMockProject, generateMockSkill } from '../mockdata';

const indexRouter = router();

indexRouter.get('/', async (req, res) => {
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

export default indexRouter;