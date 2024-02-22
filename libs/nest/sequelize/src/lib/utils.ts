import { ConfigObject, FullConfig } from './config.schema'

const enforceReplication = (config: ConfigObject): ConfigObject => {
  return Object.entries(config).reduce<ConfigObject>(
    (acc, [env, envConfig]) => {
      const replication = envConfig.replication || {
        write: envConfig,
        read: [envConfig],
      }
      const newEnvConfig: FullConfig = {
        ...envConfig,
        replication,
      }
      acc[env] = newEnvConfig
      return acc
    },
    {},
  )
}
export { enforceReplication }
