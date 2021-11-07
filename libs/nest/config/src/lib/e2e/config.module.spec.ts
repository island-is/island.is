import { Test } from '@nestjs/testing'
import * as z from 'zod'
import { ServerSideFeatureClient } from '@island.is/feature-flags'
import { logger } from '@island.is/logging'

import { defineConfig, ConfigModule, ConfigType, ConfigFactory } from '../..'

async function testInjection<T extends ConfigFactory>(config: T) {
  const moduleRef = await Test.createTestingModule({
    imports: [ConfigModule.forRoot({ load: [config] })],
  }).compile()

  return moduleRef.get<ConfigType<typeof config>>(config.KEY)
}

describe('Config definitions', () => {
  const featureIsOn = jest.spyOn(ServerSideFeatureClient, 'isOn')
  jest.spyOn(logger, 'info')
  jest.spyOn(logger, 'warn')
  jest.spyOn(logger, 'error')

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when loaded and injected', () => {
    it('should work', () => {
      // Arrange
      const config = defineConfig({ name: 'test', load: () => ({}) })

      // Act
      const result = testInjection(config)

      // Assert
      return expect(result).resolves.toEqual({ isConfigured: true })
    })

    it('should return hard coded values', () => {
      // Arrange
      const expected = { test: 'value' }
      const config = defineConfig({ name: 'test', load: () => expected })

      // Act
      const result = testInjection(config)

      // Assert
      return expect(result).resolves.toMatchObject(expected)
    })

    it('should return optional environment variables when defined', () => {
      // Arrange
      process.env.CONFIG_TEST = 'asdf'
      const config = defineConfig({
        name: 'test',
        load: (env) => ({ test: env.optional('CONFIG_TEST') }),
      })

      // Act
      const result = testInjection(config)

      // Assert
      return expect(result).resolves.toMatchObject({ test: 'asdf' })
    })

    it('should return optional environment as undefined when not defined', () => {
      // Arrange
      process.env.CONFIG_TEST = undefined
      const config = defineConfig({
        name: 'test',
        load: (env) => ({ test: env.optional('CONFIG_TEST') }),
      })

      // Act
      const result = testInjection(config)

      // Assert
      return expect(result).resolves.toMatchObject({ test: undefined })
    })

    it('should return required environment variables when defined', () => {
      // Arrange
      process.env.CONFIG_TEST = 'asdf'
      const config = defineConfig({
        name: 'test',
        load: (env) => ({ test: env.required('CONFIG_TEST') }),
      })

      // Act
      const result = testInjection(config)

      // Assert
      return expect(result).resolves.toMatchObject({ test: 'asdf' })
    })

    it('should return parsed JSON environment variables when defined', () => {
      // Arrange
      process.env.CONFIG_TEST = '{"hello": "world"}'
      const config = defineConfig({
        name: 'test',
        load: (env) => ({
          test1: env.requiredJSON('CONFIG_TEST'),
          test2: env.optionalJSON('CONFIG_TEST'),
        }),
      })

      // Act
      const result = testInjection(config)

      // Assert
      return expect(result).resolves.toMatchObject({
        test1: { hello: 'world' },
        test2: { hello: 'world' },
      })
    })

    it('should return parsed JSON number environment variables when defined', () => {
      // Arrange
      process.env.CONFIG_TEST = '123'
      const config = defineConfig({
        name: 'test',
        load: (env) => ({
          test1: env.requiredJSON('CONFIG_TEST'),
          test2: env.optionalJSON('CONFIG_TEST'),
        }),
      })

      // Act
      const result = testInjection(config)

      // Assert
      return expect(result).resolves.toMatchObject({
        test1: 123,
        test2: 123,
      })
    })

    it('should log and throw an error if there is an error parsing JSON environment variables', () => {
      // Arrange
      process.env.CONFIG_TEST = 'INVALID_JSON'
      const config = defineConfig({
        name: 'test',
        load: (env) => ({
          test1: env.requiredJSON('CONFIG_TEST'),
          test2: env.optionalJSON('CONFIG_TEST'),
        }),
      })

      // Act
      const result = testInjection(config)

      // Assert
      return expect(result).rejects.toThrow(
        'Failed loading configuration for test. Environment variable(s) could not be parsed as JSON:\n- CONFIG_TEST\n- CONFIG_TEST',
      )
    })

    // TODO: Add when we upgrade to Zod 3.
    // it('should return transformed values', () => {
    //   // Arrange
    //   process.env.CONFIG_TEST = '{"hello": "world"}'
    //   const schema = z
    //     .object({
    //       test: z.object({
    //         hello: z.string(),
    //       }),
    //     })
    //     .transform((obj) => obj.hello)
    //   const config = defineConfig({
    //     name: 'test',
    //     schema,
    //     load: (env) => ({
    //       test: env.requiredJSON('CONFIG_TEST'),
    //     }),
    //   })
    //
    //   // Act
    //   const result = testInjection(config)
    //
    //   // Assert
    //   return expect(result.test).toEqual('world')
    // })

    it('should work if server side feature is available', () => {
      // Arrange
      featureIsOn.mockReturnValue(true)
      const config = defineConfig({
        name: 'test',
        serverSideFeature: 'test_feature',
        load: () => ({ test: 'asdf' }),
      })

      // Act
      const result = testInjection(config)

      // Assert
      return expect(result).resolves.toEqual({
        isConfigured: true,
        test: 'asdf',
      })
    })

    it('should log an info if server side feature is missing', async () => {
      // Arrange
      featureIsOn.mockReturnValue(false)
      const config = defineConfig({
        name: 'test',
        serverSideFeature: 'test_feature',
        load: () => ({}),
      })

      // Act
      await testInjection(config)

      // Assert
      expect(logger.info).toHaveBeenCalledWith(
        'Ignored configuration for test. Server-side feature flag missing: test_feature',
      )
    })

    it('should ignore required variables and return isConfigured = false if a server side feature is missing', () => {
      // Arrange
      process.env.CONFIG_TEST = undefined
      featureIsOn.mockReturnValue(false)
      const config = defineConfig({
        name: 'test',
        serverSideFeature: 'test_feature',
        load: (env) => ({ test: env.required('CONFIG_TEST') }),
      })

      // Act
      const result = testInjection(config)

      // Assert
      return expect(result).resolves.toEqual({ isConfigured: false })
    })

    it('should throw useful error when reading configuration and server-side feature is missing', async () => {
      // Arrange
      process.env.CONFIG_TEST = undefined
      featureIsOn.mockReturnValue(false)
      const config = defineConfig({
        name: 'test',
        serverSideFeature: 'test_feature',
        load: (env) => ({ test: env.required('CONFIG_TEST') }),
      })

      // Act
      const result = await testInjection(config)

      // Assert
      return expect(() => result.test).rejects.toThrow(
        'Unable to read configuration for test. Server-side feature flag missing: test_feature',
      )
    })

    it('should throw a friendly error if validation fails', async () => {
      // Arrange
      process.env.CONFIG_TEST = 'asdf'
      const schema = z.object({
        test1: z.string().email(),
        test2: z.string().email(),
      })
      const config = defineConfig({
        name: 'test',
        schema,
        load: (env) => ({
          test1: env.optional('CONFIG_TEST'),
          test2: env.optional('CONFIG_TEST'),
        }),
      })

      // Act
      const result = testInjection(config)

      // Assert
      return expect(result).rejects.toThrow(
        'Failed loading configuration for test. Validation failed:\n- test1 is not an email\n- test2 is not an email',
      )
    })

    describe('in development', () => {
      beforeAll(() => {
        process.env.NODE_ENV = 'development'
      })

      it('should return devFallback and isConfigured = true when required variables are missing', () => {
        // Arrange
        process.env.CONFIG_TEST = undefined
        const config = defineConfig({
          name: 'test',
          load: (env) => ({ test: env.required('CONFIG_TEST', 'asdf') }),
        })

        // Act
        const result = testInjection(config)

        // Assert
        return expect(result).resolves.toEqual({
          isConfigured: true,
          test: 'asdf',
        })
      })

      it("should return isConfigured = false if any missing required variables don't have a devFallback", () => {
        // Arrange
        process.env.CONFIG_TEST = undefined
        const config = defineConfig({
          name: 'test',
          load: (env) => ({ test: env.required('CONFIG_TEST') }),
        })

        // Act
        const result = testInjection(config)

        // Assert
        return expect(result).resolves.toEqual({ isConfigured: false })
      })

      it("should log a warning if any missing required variables don't have a devFallback", async () => {
        // Arrange
        process.env.CONFIG_TEST = undefined
        const config = defineConfig({
          name: 'test',
          load: (env) => ({ test: env.required('CONFIG_TEST') }),
        })

        // Act
        await testInjection(config)

        // Assert
        return expect(logger.warn).toHaveBeenCalledWith(
          'Could not load configuration for test. Missing 1 required environment variable(s).',
        )
      })

      it('should throw a friendly error when reading configuration and required environment variables are missing', async () => {
        // Arrange
        process.env.CONFIG_TEST = undefined
        const config = defineConfig({
          name: 'test',
          load: (env) => ({
            test1: env.required('CONFIG_TEST'),
            test2: env.required('CONFIG_TEST'),
          }),
        })

        // Act
        const result = await testInjection(config)

        // Assert
        return expect(() => result.test1).toThrow(
          'Unable to read configuration for test. You are missing these environment variables:\n- CONFIG_TEST\n- CONFIG_TEST',
        )
      })
    })

    describe('in production', () => {
      beforeAll(() => {
        process.env.NODE_ENV = 'production'
      })

      it('should throw a friendly error when required variables are missing', () => {
        // Arrange
        process.env.CONFIG_TEST = undefined
        const config = defineConfig({
          name: 'test',
          load: (env) => ({
            test1: env.required('CONFIG_TEST'),
            test2: env.required('CONFIG_TEST'),
          }),
        })

        // Act
        const result = testInjection(config)

        // Assert
        return expect(result).rejects.toThrow(
          'Could not load configuration for test. Missing required environment variable(s):\n- CONFIG_TEST\n- CONFIG_TEST',
        )
      })
    })
  })

  it('when not loaded, should crash with a DI error', async () => {
    // Arrange
    const config = defineConfig({
      name: 'test',
      load: () => ({ test: 'asdf' }),
    })

    // Act
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [] })],
    }).compile()

    // Assert
    expect(() => moduleRef.get<ConfigType<typeof config>>(config.KEY)).toThrow(
      'BLA',
    )
  })
})
