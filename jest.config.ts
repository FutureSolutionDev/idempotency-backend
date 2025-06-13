import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^@Utils/(.*)$': '<rootDir>/src/Utils/$1',
    '^@Middleware/(.*)$': '<rootDir>/src/Middleware/$1',
    '^@Types/(.*)$': '<rootDir>/src/Types/$1',
    '^@Idempotency/(.*)$': '<rootDir>/src/Idempotency/$1'
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  }
};

export default config;
