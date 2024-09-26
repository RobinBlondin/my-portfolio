import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import { app } from '../src/app';
import { jest } from '@jest/globals';
import { generateMockSkill, generateMockProject, generateMockPresentation } from '../src/mockdata';
import { presentationRepo, projectRepo, skillRepo } from 'repositories';

jest.mock('../src/mockdata');
jest.mock('../src/repositories');
jest.mock('../src/utilities', () => ({
    startServer: jest.fn(() => Promise.resolve()),
    initializeDatabase: jest.fn(() => Promise.resolve()),
    setUploadsStorage: jest.fn(),
    upload: {
        single: jest.fn((fieldName) => (_req: any, res: any, next: () => any) => next()), 
      },
}));

const mockedPresentationRepo = jest.mocked(presentationRepo);
const mockedSKillRepo = jest.mocked(skillRepo);
const mockedProjectRepo = jest.mocked(projectRepo);

describe('App Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    
    it('if database is empty, should render index page with mockdata', async () => {
        mockedPresentationRepo.findBy.mockResolvedValue([]);
        mockedSKillRepo.find.mockResolvedValue([]);
        mockedProjectRepo.find.mockResolvedValue([]);
        
        const mockPresentation = {id: 1, name: "Robin Blondin", description: 'Mock Presentation', imageUrl: '' };
        const mockProjects = [{ id: 1, name: 'Mock Project', link: '', imageUrl: '' }];
        const mockSkills = [{ id: 1, name: 'Mock Skill', imageUrl: '' }];
        

        jest.mocked(generateMockPresentation).mockReturnValue(mockPresentation);
        jest.mocked(generateMockProject).mockReturnValue(mockProjects);
        jest.mocked(generateMockSkill).mockReturnValue(mockSkills);

        const response = await request(app).get('/');
        
        expect(response.status).toBe(200);
        expect(response.text).toContain('My Portfolio');
        expect(response.text).toContain('Mock Presentation');
        expect(response.text).toContain('Mock Skill');
        expect(response.text).toContain('Mock Project');
    });

    it('if database is not empty, should render index page with data from database', async () => {
        const mockPresentation = { id: 1, name: "Robin Blondin",  imageUrl: '', description: 'Mock Presentation' };
        const mockSkills = [{ id: 3, name: 'Mock Skill', imageUrl: '' }];
        const mockProjects = [{ id: 2, name: 'Mock Project', imageUrl: '', link: '' }];
        
        mockedPresentationRepo.findBy.mockResolvedValue([mockPresentation]);
        mockedProjectRepo.find.mockResolvedValue(mockProjects);
        mockedSKillRepo.find.mockResolvedValue(mockSkills);

        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.text).toContain('My Portfolio');
        expect(response.text).toContain('Mock Presentation');
        expect(response.text).toContain('Mock Skill');
        expect(response.text).toContain('Mock Project');
    });

     it('should render the login page with or without an error message', async () => {
        let response = await request(app).get('/login');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Login');
        expect(response.text).not.toContain('Error');

        response = await request(app).get('/login?error=Invalid credentials');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Login');
        expect(response.text).toContain('Invalid credentials');
    });

    it('should not render the admin page when not logged in', async () => {
        const response = await request(app).get('/admin');
        expect(response.status).toBe(401);
        expect(response.text).toContain('Unauthorized');
    });

    
    it('should not render the presentation edit page when not logged in', async () => {
        const response = await request(app).get('/admin/presentation');
        expect(response.status).toBe(401);
        expect(response.text).toContain('Unauthorized');
    });

    it('should not render the project add page when not logged in', async () => {
        const response = await request(app).get('/admin/project');
        expect(response.status).toBe(401);
        expect(response.text).toContain('Unauthorized');
    }); 

    it('should not render the skill add page when not logged in', async () => {
        const response = await request(app).get('/admin/skill');
        expect(response.status).toBe(401);
        expect(response.text).toContain('Unauthorized');
    });
});