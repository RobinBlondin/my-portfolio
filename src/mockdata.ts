export function generateMockPresentation() {
    return {
        id: 1,
        name: 'Robin Blondin',
        description: 'Mocked description',
        imageUrl: 'dist/img/mocks/profile.jpg'
    };
}

export function generateMockProject() {
    return [{
        id: 1,
        name: 'Mocked project',
        link: 'https://mocked.com',
        imageUrl: 'dist/img/mocks/project.jpg'
    }];
}

export function generateMockSkill() {
    return [{
        id: 1,
        name: 'Mocked skill',
        imageUrl: 'dist/img/mocks/postgres.png'
    }];
}