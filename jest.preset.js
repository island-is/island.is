const path = require('path')
const nxPreset = require('@nrwl/jest/preset')

const customResolver = path.join(__dirname, 'jest.resolver.js')

module.exports = {
  ...nxPreset,
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  resolver: customResolver,
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['html'],
}
