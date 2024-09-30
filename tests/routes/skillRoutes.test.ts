import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import { app } from '../../src/app';
import { jest } from '@jest/globals';
import { skillRepo } from 'repositories';
import { SkillUploadConfig } from '../SkillUploadConfig';

let mockUploadConfig: any;

jest.mock('jsonwebtoken');
jest.mock('../../src/repositories');
jest.mock('../../src/utilities', () => ({
    startServer: jest.fn(() => Promise.resolve()),
    initializeDatabase: jest.fn(() => Promise.resolve()),
    setPathOfFile: jest.fn(() => 'uploads/testfile.png'),
    upload: {
        single: jest.fn((fieldName) => (req: any, res: any, next: () => any) => {
            req.file = mockUploadConfig.file;
            req.body = mockUploadConfig.body;
            next();
        }),
      },
}));

const mockedSkillRepo = jest.mocked(skillRepo);

describe('Edit presentation POST Routes', () => {
    let skillUpload: SkillUploadConfig;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        mockedSkillRepo.findBy.mockResolvedValue([]);

        skillUpload = new SkillUploadConfig();
        mockUploadConfig = skillUpload.valid();
    });

    it('if missing all input fields, should give feedback of missing input fields', async () => {
        mockUploadConfig = skillUpload.missingAllFields();

        const response = await request(app)
            .post('/admin/skill')
            .set('Cookie', 'token=valid-token')
            .redirects(1);
                                                    
        expect(response.status).toBe(200);
        expect(response.text).toContain("Missing input fields");
    });

    it('if missing text inputs should give feedback of missing input field', async () => {
        mockUploadConfig = skillUpload.missingTextInputs();

        const response = await request(app)
            .post('/admin/skill')
            .set('Cookie', 'token=valid-token')
            .redirects(1);
                                                    
        expect(response.status).toBe(200);
        expect(response.text).toContain("Missing input fields");
    });

    it('if missing input: file, should give feedback of missing input field', async () => {
        mockUploadConfig = skillUpload.missingFile();

        const response = await request(app)
            .post('/admin/skill')
            .set('Cookie', 'token=valid-token')
            .redirects(1);
        
        expect(response.status).toBe(200);
        expect(response.text).toContain("Missing input fields");
    });

    it('if all fields are filled in, should redirect to admin page', async () => {
        mockUploadConfig = skillUpload.valid();

        const response = await request(app)
            .post('/admin/skill')
            .set('Cookie', 'token=valid-token')
            .redirects(1);

        expect(response.status).toBe(200);
        expect(response.text).toContain('Skill added');
    });
});
