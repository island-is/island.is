import { Module } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { z } from 'zod'

import {
  ServerSideFeatureClient,
  ServerSideFeature,
} from '@island.is/feature-flags'
import { logger } from '@island.is/logging'

import { ConfigFactory, ConfigModule, ConfigType, defineConfig } from '../..'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function testInjection<T extends ConfigFactory<any>>(config: T) {
  const moduleRef = await Test.createTestingModule({
    imports: [ConfigModule.forRoot({ load: [config] })],
  }).compile()

  return moduleRef.get<ConfigType<typeof config>>(config.KEY)
}

describe('Config definitions', () => {
  const featureIsOn = jest.spyOn(ServerSideFeatureClient, 'isOn')
  jest.spyOn(logger, 'info').mockImplementation()
  jest.spyOn(logger, 'warn').mockImplementation()
  jest.spyOn(logger, 'error').mockImplementation()

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
      delete process.env.CONFIG_TEST
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
      process.env.CONFIG_TEST1 = '{"hello": "world"}'
      process.env.CONFIG_TEST2 = '{"hello": "world"}'
      const config = defineConfig({
        name: 'test',
        load: (env) => ({
          test1: env.requiredJSON('CONFIG_TEST1'),
          test2: env.optionalJSON('CONFIG_TEST2'),
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
      process.env.CONFIG_TEST1 = '123'
      process.env.CONFIG_TEST2 = '123'
      const config = defineConfig({
        name: 'test',
        load: (env) => ({
          test1: env.requiredJSON('CONFIG_TEST1'),
          test2: env.optionalJSON('CONFIG_TEST2'),
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
      process.env.CONFIG_TEST1 = 'INVALID_JSON'
      process.env.CONFIG_TEST2 = 'INVALID_JSON'
      const config = defineConfig({
        name: 'test',
        load: (env) => ({
          test1: env.requiredJSON('CONFIG_TEST1'),
          test2: env.optionalJSON('CONFIG_TEST2'),
        }),
      })

      // Act
      const result = testInjection(config)

      // Assert
      return expect(result).rejects.toThrow(
        'Failed loading configuration for test:\n- CONFIG_TEST1 could not be parsed as JSON\n- CONFIG_TEST2 could not be parsed as JSON',
      )
    })

    it('should return transformed values', () => {
      // Arrange
      process.env.CONFIG_TEST = '{"hello": "world"}'
      const schema = z
        .object({
          test: z.object({
            hello: z.string(),
          }),
        })
        .transform((obj) => obj.test)
      const config = defineConfig({
        name: 'test',
        schema,
        load: (env) => ({
          test: env.requiredJSON('CONFIG_TEST'),
        }),
      })

      // Act
      const result = testInjection(config)

      // Assert
      return expect(result).resolves.toEqual({
        isConfigured: true,
        test: { hello: 'world' },
      })
    })

    it('should work if server side feature is available', () => {
      // Arrange
      featureIsOn.mockReturnValue(true)
      const config = defineConfig({
        name: 'test',
        serverSideFeature: 'test_feature' as ServerSideFeature,
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
        serverSideFeature: 'test_feature' as ServerSideFeature,
        load: () => ({}),
      })

      // Act
      await testInjection(config)

      // Assert
      expect(logger.info).toHaveBeenCalledWith({
        category: 'ConfigModule',
        message:
          'Ignored configuration for test. Server-side feature flag missing: test_feature',
      })
    })

    it('should ignore required variables and return isConfigured = false if a server side feature is missing', async () => {
      // Arrange
      delete process.env.CONFIG_TEST
      featureIsOn.mockReturnValue(false)
      const config = defineConfig({
        name: 'test',
        serverSideFeature: 'test_feature' as ServerSideFeature,
        load: (env) => ({ test: env.required('CONFIG_TEST') }),
      })

      // Act
      const result = await testInjection(config)

      // Assert
      return expect(result.isConfigured).toEqual(false)
    })

    it('should throw useful error when reading configuration and server-side feature is missing', async () => {
      // Arrange
      delete process.env.CONFIG_TEST
      featureIsOn.mockReturnValue(false)
      const config = defineConfig({
        name: 'test',
        serverSideFeature: 'test_feature' as ServerSideFeature,
        load: (env) => ({ test: env.required('CONFIG_TEST') }),
      })

      // Act
      const result = await testInjection(config)

      // Assert
      return expect(() => result.test).toThrow(
        'Unable to read configuration for test. Server-side feature flag missing: test_feature',
      )
    })

    it('should work if globally optional', () => {
      // Arrange
      const config = defineConfig({
        name: 'test',
        optional: true,
        load: () => ({
          test: 'value',
        }),
      })

      // Act
      const result = testInjection(config)

      // Assert
      return expect(result).resolves.toEqual({
        isConfigured: true,
        test: 'value',
      })
    })

    it('should work if registered optional', async () => {
      // Arrange
      const config = defineConfig({
        name: 'test',
        load: () => ({
          test: 'value',
        }),
      })

      // Act
      const moduleRef = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({ isGlobal: true, load: [] }),
          config.registerOptional(),
        ],
      }).compile()

      // Assert
      expect(moduleRef.get<ConfigType<typeof config>>(config.KEY)).toEqual({
        isConfigured: true,
        test: 'value',
      })
    })

    it('should throw an error if optional config is used not fully provided', async () => {
      // Arrange
      const config = defineConfig({
        name: 'test',
        load: (env) => ({
          test: env.required('CONFIG_TEST'),
        }),
      })

      // Act
      const moduleRef = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({ isGlobal: true, load: [config.optional()] }),
        ],
      }).compile()

      // Assert
      expect(() => {
        const conf = moduleRef.get<ConfigType<typeof config>>(config.KEY)

        // Accessing the property cause the error to be thrown
        conf.test
      }).toThrow(
        'Failed loading configuration for test:\n- CONFIG_TEST missing',
      )
    })

    it('should throw a friendly error if validation fails', async () => {
      // Arrange
      process.env.CONFIG_TEST1 = 'asdf'
      process.env.CONFIG_TEST2 = 'asdf'
      const schema = z.object({
        test1: z.string().email(),
        test2: z.string().email(),
      })
      const config = defineConfig({
        name: 'test',
        schema,
        load: (env) => ({
          test1: env.optional('CONFIG_TEST1'),
          test2: env.optional('CONFIG_TEST2'),
        }),
      })

      // Act
      const result = testInjection(config)

      // Assert
      return expect(result).rejects.toThrow(
        'Failed loading configuration for test. Validation failed:\n- test1: Invalid email\n- test2: Invalid email',
      )
    })

    it('should not swallow errors', () => {
      // Arrange
      const config = defineConfig<{ test: string }>({
        name: 'test',
        load: (env) => {
          throw new Error('Unexpected error')
        },
      })

      // Act
      const result = testInjection(config)

      // Assert
      return expect(result).rejects.toThrow('Unexpected error')
    })

    describe('in development', () => {
      beforeAll(() => {
        process.env.NODE_ENV = 'development'
      })

      it('should return devFallback when optional variables are missing', () => {
        // Arrange
        delete process.env.CONFIG_TEST1
        delete process.env.CONFIG_TEST2
        const config = defineConfig({
          name: 'test',
          load: (env) => ({
            test1: env.optional('CONFIG_TEST1', 'asdf'),
            test2: env.optionalJSON('CONFIG_TEST2', 123),
          }),
        })

        // Act
        const result = testInjection(config)

        // Assert
        return expect(result).resolves.toEqual({
          isConfigured: true,
          test1: 'asdf',
          test2: 123,
        })
      })

      it('should return devFallback and isConfigured = true when required variables are missing', () => {
        // Arrange
        delete process.env.CONFIG_TEST1
        delete process.env.CONFIG_TEST2
        const config = defineConfig({
          name: 'test',
          load: (env) => ({
            test1: env.required('CONFIG_TEST1', 'asdf'),
            test2: env.requiredJSON('CONFIG_TEST2', 123),
          }),
        })

        // Act
        const result = testInjection(config)

        // Assert
        return expect(result).resolves.toEqual({
          isConfigured: true,
          test1: 'asdf',
          test2: 123,
        })
      })

      it("should return isConfigured = false if any missing required variables don't have a devFallback", async () => {
        // Arrange
        delete process.env.CONFIG_TEST
        const config = defineConfig({
          name: 'test',
          load: (env) => ({ test: env.required('CONFIG_TEST') }),
        })

        // Act
        const result = await testInjection(config)

        // Assert
        return expect(result.isConfigured).toEqual(false)
      })

      it("should log a warning if any missing required variables don't have a devFallback", async () => {
        // Arrange
        delete process.env.CONFIG_TEST
        const config = defineConfig({
          name: 'test',
          load: (env) => ({ test: env.required('CONFIG_TEST') }),
        })

        // Act
        await testInjection(config)

        // Assert
        return expect(logger.warn).toHaveBeenCalledWith({
          category: 'ConfigModule',
          message:
            'Could not load configuration for test. Missing 1 required environment variable(s).',
        })
      })

      it('should throw a friendly error when reading configuration and required environment variables are missing', async () => {
        // Arrange
        delete process.env.CONFIG_TEST1
        delete process.env.CONFIG_TEST2
        const config = defineConfig({
          name: 'test',
          load: (env) => ({
            test1: env.required('CONFIG_TEST1'),
            test2: env.required('CONFIG_TEST2'),
          }),
        })

        // Act
        const result = await testInjection(config)

        // Assert
        return expect(() => result.test1).toThrow(
          'Failed loading configuration for test:\n- CONFIG_TEST1 missing\n- CONFIG_TEST2 missing',
        )
      })
    })

    describe('in production', () => {
      beforeAll(() => {
        process.env.NODE_ENV = 'production'
      })

      it('should throw a friendly error when required variables are missing', () => {
        // Arrange
        delete process.env.CONFIG_TEST1
        delete process.env.CONFIG_TEST2
        const config = defineConfig({
          name: 'test',
          load: (env) => ({
            test1: env.required('CONFIG_TEST1'),
            test2: env.required('CONFIG_TEST2'),
          }),
        })

        // Act
        const result = testInjection(config)

        // Assert
        return expect(result).rejects.toThrow(
          'Failed loading configuration for test:\n- CONFIG_TEST1 missing\n- CONFIG_TEST2 missing',
        )
      })

      it('should swallow thrown error if there are missing environment variables', () => {
        // Arrange
        delete process.env.CONFIG_TEST
        const config = defineConfig<{ test: string }>({
          name: 'test',
          load: (env) => {
            env.required('CONFIG_TEST')
            throw new Error('Failed running load')
          },
        })

        // Act
        const result = testInjection(config)

        // Assert
        return expect(result).rejects.toThrow(
          'Failed loading configuration for test:\n- CONFIG_TEST missing',
        )
      })

      it('should throw an error when required in root and optional in nested module and not provided', async () => {
        // Arrange
        const config = defineConfig({
          name: 'test',
          load: (env) => ({
            test: env.required('CONFIG_TEST'),
          }),
        })

        @Module({
          imports: [config.registerOptional()],
        })
        class NestedModule {}

        // Act
        const act = () =>
          Test.createTestingModule({
            imports: [
              ConfigModule.forRoot({ isGlobal: true, load: [config] }),
              NestedModule,
            ],
          }).compile()

        // Assert
        return expect(act).rejects.toThrow(
          'Failed loading configuration for test:\n- CONFIG_TEST missing',
        )
      })

      it('should throw an error when optional in root and required in nested module and not provided', async () => {
        // Arrange
        const config = defineConfig({
          name: 'test',
          load: (env) => ({
            test: env.required('CONFIG_TEST'),
          }),
        })

        @Module({
          imports: [ConfigModule.forFeature(config)],
        })
        class NestedModule {}

        // Act
        const act = () =>
          Test.createTestingModule({
            imports: [
              ConfigModule.forRoot({
                isGlobal: true,
                load: [config.optional()],
              }),
              NestedModule,
            ],
          }).compile()

        // Assert
        return expect(act).rejects.toThrow(
          'Failed loading configuration for test:\n- CONFIG_TEST missing',
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
      'Nest could not find CONFIGURATION(test) element (this provider does not exist in the current context)',
    )
  })
})
