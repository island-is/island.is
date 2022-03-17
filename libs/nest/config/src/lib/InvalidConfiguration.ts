import { ConfigurationError } from './ConfigurationError'

export class InvalidConfiguration {
  // These members are not likely to be used as configuration keys, but are
  // likely to be accessed "accidentally" when passing the InvalidConfiguration
  // around.
  static allowedMembers = [
    // async-await.
    'then',

    // NX.
    'onModuleInit',
    'onModuleDestroy',
    'onApplicationBootstrap',
    'onApplicationShutdown',
    'beforeApplicationShutdown',

    // Winston
    'message',
    'stack',
  ]

  isConfigured = false

  constructor(errorMessage: string) {
    return new Proxy(this, {
      get(target, prop) {
        if (
          prop in target ||
          InvalidConfiguration.allowedMembers.includes(String(prop))
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (target as any)[prop]
        }
        throw new ConfigurationError(errorMessage)
      },
    })
  }
}
