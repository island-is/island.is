import { ConfigModule, registerAs } from '@nestjs/config'

import { ConfigurationLoader } from './ConfigurationLoader'
import { ConfigDefinition, ConfigFactory } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defineConfig = <T extends Record<string, any>>(
  definition: ConfigDefinition<T>,
): ConfigFactory<T> => {
  const loader = new ConfigurationLoader<T>(definition)
  const factory = registerAs(definition.name, () => {
    return loader.load()
  }) as unknown as ConfigFactory<T>

  factory.optional = () => {
    const cloneDefinition = Object.assign(
      {},
      {
        ...definition,
        optional: true,
      },
    )
    return defineConfig(cloneDefinition)
  }

  factory.registerOptional = () => ConfigModule.forFeature(factory.optional())

  return factory
}
