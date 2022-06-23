import { DynamicModule } from '@nestjs/common'
import { ZodType } from 'zod'

import { ServerSideFeatureNames } from '@island.is/feature-flags'

export interface EnvLoader {
  required(envVariable: string, devFallback?: string): string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requiredJSON<T = any>(envVariable: string, devFallback?: T): T

  optional(envVariable: string, devFallback?: string): string | undefined

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionalJSON<T = any>(envVariable: string, devFallback?: T): T | undefined
}

export type Configuration<T> = T & { isConfigured: boolean }

export type ConfigFactory<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any> = Record<string, any>
> = (() => Configuration<T>) & {
  KEY: string
  optional: () => ConfigFactory<T>
  registerOptional: () => DynamicModule
}

export type ConfigType<T extends ConfigFactory> = ReturnType<T>

export interface ConfigDefinition<T> {
  name: string
  schema?: ZodType<T>
  optional?: boolean
  serverSideFeature?: ServerSideFeatureNames
  load: (env: EnvLoader) => T
}
