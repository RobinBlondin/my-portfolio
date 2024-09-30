import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import { app } from '../../src/app';
import { jest } from '@jest/globals';
import { presentationRepo } from 'repositories';
import { PresentationUploadConfig } from '../PresentationUploadConfig';

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

const mockedPresentationRepo = jest.mocked(presentationRepo);

describe('Edit presentation POST Routes', () => {
    let presentationUpload: PresentationUploadConfig;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        mockedPresentationRepo.findBy.mockResolvedValue([]);

        presentationUpload = new PresentationUploadConfig();
        mockUploadConfig = presentationUpload.valid();
    });

    it('if missing all input fields, should give feedback of missing input fields', async () => {
        mockUploadConfig = presentationUpload.missingAllFields();

        const response = await request(app)
            .post('/admin/presentation')
            .set('Cookie', 'token=valid-token')
            .redirects(1);
                                                    
        expect(response.status).toBe(200);
        expect(response.text).toContain("Missing input fields");
    });

    it('if missing text inputs should give feedback of missing input field', async () => {
        mockUploadConfig = presentationUpload.missingTextInputs();

        const response = await request(app)
            .post('/admin/presentation')
            .set('Cookie', 'token=valid-token')
            .redirects(1);
                                                    
        expect(response.status).toBe(200);
        expect(response.text).toContain("Missing input fields");
    });

    it('if missing input: file, should give feedback of missing input field', async () => {
        mockUploadConfig = presentationUpload.missingFile();

        const response = await request(app)
            .post('/admin/presentation')
            .set('Cookie', 'token=valid-token')
            .redirects(1);
        
        expect(response.status).toBe(200);
        expect(response.text).toContain("Missing input fields");
    });

    it('if all fields are filled in, should redirect to admin page', async () => {
        mockUploadConfig = presentationUpload.valid();

        const response = await request(app)
            .post('/admin/presentation')
            .set('Cookie', 'token=valid-token')
            .redirects(1);

        expect(response.status).toBe(200);
        expect(response.text).toContain('Presentation updated');
    });
});
