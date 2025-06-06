/**
 * @jest-environment node
 */
/* eslint-disable  @typescript-eslint/no-var-requires */

// eslint-disable-next-line no-restricted-imports
import { cloneDeep } from 'lodash'

describe('isRunningOnEnvironment', () => {
  const processEnvCopy = cloneDeep(process.env)

  afterEach(() => {
    jest.resetModules()
    process.env = cloneDeep(processEnvCopy)
  })

  it('should return true for local environment when running locally', () => {
    process.env.NODE_ENV = 'development'
    process.env.name = undefined

    const { isRunningOnEnvironment } = require('./environment')

    expect(isRunningOnEnvironment('local')).toBe(true)
  })

  it('should return true for dev environment when running on dev', () => {
    process.env.name = 'dev'

    const { isRunningOnEnvironment } = require('./environment')

    expect(isRunningOnEnvironment('dev')).toBe(true)
  })

  it('should return false for dev environment when not running on dev', () => {
    process.env.name = 'not dev'

    const { isRunningOnEnvironment } = require('./environment')

    expect(isRunningOnEnvironment('dev')).toBe(false)
  })

  it('should return true for staging environment when running on staging', () => {
    process.env.name = 'staging'

    const { isRunningOnEnvironment } = require('./environment')

    expect(isRunningOnEnvironment('staging')).toBe(true)
  })

  it('should return false for staging environment when not running on staging', () => {
    process.env.name = 'not staging'

    const { isRunningOnEnvironment } = require('./environment')

    expect(isRunningOnEnvironment('staging')).toBe(false)
  })

  it('should return true for production environment when running on production', () => {
    process.env.name = 'production'

    const { isRunningOnEnvironment } = require('./environment')

    expect(isRunningOnEnvironment('production')).toBe(true)
  })

  it('should return false for production environment when not running on production', () => {
    process.env.name = 'not production'

    const { isRunningOnEnvironment } = require('./environment')

    expect(isRunningOnEnvironment('production')).toBe(false)
  })
})

describe('getEnvVarOrThrow', () => {
  const processEnvCopy = cloneDeep(process.env)

  afterEach(() => {
    jest.resetModules()
    process.env = cloneDeep(processEnvCopy)
  })

  it('should throw an error if the environment variable is not set', () => {
    const { getEnvVarOrThrow } = require('./environment')

    expect(() => getEnvVarOrThrow('TEST_ENV_VAR')).toThrow()
  })

  it('should return the default value if the environment variable is not set', () => {
    const { getEnvVarOrThrow } = require('./environment')

    expect(getEnvVarOrThrow('TEST_ENV_VAR', 'default')).toBe('default')
  })

  it('should return the environment variable if it is set', () => {
    const { getEnvVarOrThrow } = require('./environment')
    process.env.TEST_ENV_VAR = 'test'

    expect(getEnvVarOrThrow('TEST_ENV_VAR')).toBe('test')
  })
})
