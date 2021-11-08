import { ZodType } from 'zod'
import { ServerSideFeatureNames } from '@island.is/feature-flags'

export interface EnvLoader {
  required(envVariable: string, devFallback?: string): string

  requiredJSON<T = any>(envVariable: string, devFallback?: T): T

  optional(envVariable: string): string | undefined

  optionalJSON<T = any>(envVariable: string): T | undefined
}

export type Configuration<T> = T & { isConfigured: boolean }

export type ConfigFactory<
  T extends Record<string, any> = Record<string, any>
> = (() => Configuration<T>) & { KEY: string }

export type ConfigType<T extends ConfigFactory> = ReturnType<T>

export interface ConfigDefinition<T> {
  name: string
  schema?: ZodType<T>
  serverSideFeature?: ServerSideFeatureNames
  load: (env: EnvLoader) => T
}
