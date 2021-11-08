import { ConfigurationError } from './ConfigurationError'

export class InvalidConfiguration {
  static allowedMembers = ['then']
  isConfigured = false

  constructor(errorMessage: string) {
    return new Proxy(this, {
      get(target, prop) {
        if (
          prop in target ||
          InvalidConfiguration.allowedMembers.includes(String(prop))
        ) {
          return (target as any)[prop]
        }
        throw new ConfigurationError(errorMessage)
      },
    })
  }
}
