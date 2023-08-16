import { ZodError } from 'zod'

import { ServerSideFeatureClient } from '@island.is/feature-flags'
import { logger } from '@island.is/logging'

import {
  ConfigurationError,
  ConfigurationValidationError,
} from './ConfigurationError'
import { InvalidConfiguration } from './InvalidConfiguration'
import { Issues, IssueType } from './Issues'
import { ConfigDefinition, Configuration, EnvLoader } from './types'

export class ConfigurationLoader<T> implements EnvLoader {
  private allowDevFallback = process.env.NODE_ENV !== 'production'
  private issues = new Issues()

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
      return this.handleResult(undefined, err as Error)
    }
  }

  private handleResult(result?: T, error?: Error) {
    // Always throw if there are any parse issues.
    if (this.issues.hasParseIssue) {
      throw new ConfigurationError(this.formatConfigurationError())
    }

    if (this.issues.hasMissingIssue && this.definition.optional) {
      return new InvalidConfiguration(
        this.formatConfigurationError(),
      ) as Configuration<T>
    }

    // Only throw missing issue in production
    if (this.issues.hasMissingIssue && !this.allowDevFallback) {
      throw new ConfigurationError(this.formatConfigurationError())
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

    if (this.allowDevFallback && this.issues.hasMissingIssue) {
      logger.warn({
        message: `Could not load configuration for ${this.definition.name}. Missing ${this.issues.count} required environment variable(s).`,
        category: 'ConfigModule',
      })
      return new InvalidConfiguration(
        this.formatConfigurationError(),
      ) as Configuration<T>
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
      const error = new ConfigurationValidationError(
        `Failed loading configuration for ${this.definition.name}. Validation failed:`,
        (parseResult as { error: ZodError }).error,
      )

      // Log error to get zod details.
      logger.error({
        message: error.message,
        category: 'ConfigModule',
        zodError: error.zodError,
      })
      throw error
    }
  }

  private formatConfigurationError() {
    return `Failed loading configuration for ${
      this.definition.name
    }:\n${this.issues.formatIssues()}`
  }

  required(envVariable: string, devFallback?: string): string {
    const value = process.env[envVariable]
    if (value !== undefined) {
      return value
    }
    if (this.allowDevFallback && devFallback !== undefined) {
      return devFallback
    }
    this.issues.add(envVariable, IssueType.MISSING)
    return undefined as unknown as string
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requiredJSON<T = any>(envVariable: string, devFallback?: T): T {
    const value = process.env[envVariable]
    if (value !== undefined) {
      try {
        return JSON.parse(value)
      } catch {
        this.issues.add(envVariable, IssueType.JSON_ERROR)
        return undefined as unknown as T
      }
    }
    if (this.allowDevFallback && devFallback !== undefined) {
      return devFallback
    }
    this.issues.add(envVariable, IssueType.MISSING)
    return undefined as unknown as T
  }

  optional(envVariable: string, devFallback?: string): string | undefined {
    const value = process.env[envVariable]
    if (value !== undefined) {
      return value
    }
    if (this.allowDevFallback) {
      return devFallback
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionalJSON<T = any>(envVariable: string, devFallback?: T): T | undefined {
    const value = process.env[envVariable]
    if (value !== undefined) {
      try {
        return JSON.parse(value)
      } catch {
        this.issues.add(envVariable, IssueType.JSON_ERROR)
        return undefined as unknown as T
      }
    }

    if (this.allowDevFallback) {
      return devFallback
    }
  }
}
