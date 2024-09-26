module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node', 
    moduleFileExtensions: ['ts', 'js'],
    transform: {
      '^.+\\.ts$': 'ts-jest'
    },
    testMatch: ['**/tests/**/*.test.ts'], 
    moduleDirectories: ['node_modules', 'src'],
    setupFiles: ['<rootDir>/tests/testSetup.ts'],
  };