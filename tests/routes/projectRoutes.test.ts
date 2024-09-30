import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import { app } from '../../src/app';
import { jest } from '@jest/globals';
import { ProjectUploadConfig } from '../ProjectUploadConfig';

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

describe('Add project POST Routes', () => {
    let projectUpload: ProjectUploadConfig;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();

        projectUpload = new ProjectUploadConfig();
        mockUploadConfig = projectUpload.valid();
    });

    it('if missing all input fields, should give feedback of missing input fields', async () => {
        mockUploadConfig = projectUpload.missingAllFields();

        const response = await request(app)
            .post('/admin/project')
            .set('Cookie', 'token=valid-token')
            .redirects(1);
                                                    
        expect(response.status).toBe(200);
        expect(response.text).toContain("Missing input fields");
    });

    it('if missing text inputs, should give feedback of missing input fields', async () => {
        mockUploadConfig = projectUpload.missingTextInputs();

        const response = await request(app)
            .post('/admin/project')
            .set('Cookie', 'token=valid-token')
            .redirects(1);
                                                    
        expect(response.status).toBe(200);
        expect(response.text).toContain("Missing input fields");
    });

    it('if missing input: file, should give feedback of missing input field', async () => {
        mockUploadConfig = projectUpload.missingFile();

        const response = await request(app)
            .post('/admin/project')
            .set('Cookie', 'token=valid-token')
            .redirects(1);
        
        expect(response.status).toBe(200);
        expect(response.text).toContain("Missing input fields");
    });

    it('if all fields are filled in, should redirect to admin page', async () => {
        mockUploadConfig = projectUpload.valid();

        const response = await request(app)
            .post('/admin/project')
            .set('Cookie', 'token=valid-token')
            .redirects(1);

        expect(response.status).toBe(200);
        expect(response.text).toContain('Project added');
    }); 
});