const {resolve} = require('path');
const root = resolve(__dirname);
module.exports = {
    rootDir: root,
    displayName: 'root-tests',
    testMatch: ['<rootDir>/src/**/*.test.ts'],
    testEnviroment:'node',
    clearMocks: true,
    present: 'ts-jest',
    moduleNameMapper: {
        '@src/(.*)': '<rootDir>/src/$1',
        '@test/(.*)': '<rootDir>/src/test/$1',
    },
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
};