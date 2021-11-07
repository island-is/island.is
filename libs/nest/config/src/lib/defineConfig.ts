import { registerAs } from '@nestjs/config'

class EnvLoader {
  required(envVariable: string, devFallback?: string): string {
    return this.optional(envVariable) ?? devFallback!
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requiredJSON<T = any>(envVariable: string, devFallback?: T): T {
    return this.optionalJSON(envVariable) ?? devFallback!
  }

  optional(envVariable: string): string | undefined {
    return process.env[envVariable]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionalJSON(envVariable: string): any | undefined {
    return process.env[envVariable] !== undefined
      ? JSON.parse(process.env[envVariable]!)
      : undefined
  }
}

export type ConfigFactory<
  T extends Record<string, any> = Record<string, any>
> = (() => T) & { KEY: string }

export type ConfigType<T extends ConfigFactory> = ReturnType<T> & {
  isConfigured: boolean
}

export interface ConfigDefinition<T> {
  name: string
  schema?: { _type: T }
  serverSideFeature?: string
  load: (env: EnvLoader) => T
}

export const defineConfig = <T>(
  definition: ConfigDefinition<T>,
): ConfigFactory<T> => {
  return registerAs(definition.name, () => {
    const result = definition.load(new EnvLoader())
    return {
      ...result,
      isConfigured: true,
    }
  })
}
