import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import { app } from "../../src/app";
import { jest } from '@jest/globals';
import { generateMockPresentation, generateMockProject, generateMockSkill } from "../../src/mockdata";
import { presentationRepo, projectRepo, skillRepo } from "../../src/repositories";

const mockedPresentationRepo = jest.mocked(presentationRepo);
const mockedSKillRepo = jest.mocked(skillRepo);
const mockedProjectRepo = jest.mocked(projectRepo);

jest.mock('../../src/mockdata');
jest.mock('../../src/repositories');
jest.mock('../../src/utilities', () => ({
    startServer: jest.fn(() => Promise.resolve()),
    initializeDatabase: jest.fn(() => Promise.resolve()),
    upload: {
        single: jest.fn((fieldName) => (req: any, res: any, next: () => any) => next())
      },
}));

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
        
        mockedPresentationRepo.findBy.mockResolvedValue([mockPresentation]);
        mockedSKillRepo.find.mockResolvedValue(mockSkills);

        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.text).toContain('My Portfolio');
        expect(response.text).toContain('Mock Presentation');
        expect(response.text).toContain('Mock Skill');
    
    });

});