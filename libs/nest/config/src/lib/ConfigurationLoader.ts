import { ConfigDefinition, Configuration, EnvLoader } from './types'
import { ServerSideFeatureClient } from '@island.is/feature-flags'
import { logger } from '@island.is/logging'
import { InvalidConfiguration } from './InvalidConfiguration'
import { ConfigurationError } from './ConfigurationError'
import { ZodError } from 'zod'

type Issue = 'missing' | 'could not be parsed as JSON'

export class ConfigurationLoader<T> implements EnvLoader {
  private isDev = process.env.NODE_ENV !== 'production'
  private issues: Record<string, Issue> = {}

  constructor(private definition: ConfigDefinition<T>) {}

  load(): Configuration<T> {
    if (
      this.definition.serverSideFeature &&
      !ServerSideFeatureClient.isOn(this.definition.serverSideFeature)
    ) {
      logger.info({
        category: 'ConfigModule',
        message: `Ignored configuration for ${this.definition.name}. Server-side feature flag missing: ${this.definition.serverSideFeature}`,
      })
      return new InvalidConfiguration(
        `Unable to read configuration for ${this.definition.name}. Server-side feature flag missing: ${this.definition.serverSideFeature}`,
      ) as Configuration<T>
    }

    try {
      const result = this.definition.load(this)

      // Loader did not crash, but there might still be issues we need to deal with.
      return this.handleResult(result)
    } catch (err) {
      // Loader crashed. If there are reported issues, throw those instead.
      return this.handleResult(undefined, err)
    }
  }

  private handleResult(result?: T, error?: Error) {
    const issues = Object.entries(this.issues)
    const errorMessage = this.formatIssues(issues)
    const hasParseIssue = issues.find(
      (issue) => issue[1] === 'could not be parsed as JSON',
    )
    const hasMissingIssue = !hasParseIssue && issues.length > 0

    // Always throw if there are any parse issues.
    if (hasParseIssue) {
      throw new ConfigurationError(errorMessage)
    }

    // Only throw missing issue in production
    if (hasMissingIssue && !this.isDev) {
      throw new ConfigurationError(errorMessage)
    }

    // Re-throw other unexpected errors from loader.
    if (error) {
      throw error
    }

    if (result === undefined) {
      throw new ConfigurationError(
        `Failed loading configuration for ${this.definition.name}. Config was undefined.`,
      )
    }

    if (this.isDev && hasMissingIssue) {
      logger.warn({
        message: `Could not load configuration for ${this.definition.name}. Missing ${issues.length} required environment variable(s).`,
        category: 'ConfigModule',
      })
      return new InvalidConfiguration(errorMessage) as Configuration<T>
    }

    this.validateSchema(result)

    return {
      ...result,
      isConfigured: true,
    }
  }

  private validateSchema(result: T) {
    if (!this.definition.schema) {
      return
    }

    const parseResult = this.definition.schema.safeParse(result)

    if (!parseResult.success) {
      throw new ConfigurationError(
        this.formatValidationErrors(parseResult.error),
      )
    }
  }

  private formatIssues(issues: Array<[string, Issue]>) {
    const formattedIssues = issues
      .map((issue) => `- ${issue[0]} ${issue[1]}`)
      .join('\n')
    return `Failed loading configuration for ${this.definition.name}:\n${formattedIssues}`
  }

  private formatValidationErrors(error: ZodError) {
    const formattedErrors = error.errors
      .map((error) => `- ${error.path.join('.') || '<ROOT>'}: ${error.message}`)
      .join('\n')
    return `Failed loading configuration for ${this.definition.name}. Validation failed:\n${formattedErrors}`
  }

  required(envVariable: string, devFallback?: string): string {
    const value = process.env[envVariable]
    if (value !== undefined) {
      return value
    }
    if (this.isDev && devFallback !== undefined) {
      return devFallback
    }
    this.issues[envVariable] = 'missing'
    return (undefined as unknown) as string
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requiredJSON<T = any>(envVariable: string, devFallback?: T): T {
    const value = process.env[envVariable]
    if (value !== undefined) {
      try {
        return JSON.parse(value)
      } catch {
        this.issues[envVariable] = 'could not be parsed as JSON'
        return (undefined as unknown) as T
      }
    }
    if (this.isDev && devFallback !== undefined) {
      return devFallback
    }
    this.issues[envVariable] = 'missing'
    return (undefined as unknown) as T
  }

  optional(envVariable: string): string | undefined {
    return process.env[envVariable]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionalJSON<T = any>(envVariable: string): T | undefined {
    const value = process.env[envVariable]
    if (value === undefined) {
      return undefined
    }

    try {
      return JSON.parse(value)
    } catch (err) {
      this.issues[envVariable] = 'could not be parsed as JSON'
      return (undefined as unknown) as T
    }
  }
}
