import { registerAs } from '@nestjs/config'
import { ConfigDefinition, ConfigFactory } from './types'
import { ConfigurationLoader } from './ConfigurationLoader'

export const defineConfig = <T extends Record<string, any>>(
  definition: ConfigDefinition<T>,
): ConfigFactory<T> => {
  const loader = new ConfigurationLoader<T>(definition)
  return registerAs(definition.name, () => {
    return loader.load()
  })
}
