export const HealthCheckOptionsProviderKey = 'HealthCheckOptions'

// Add to this type as needed new type of dependencies supported by the health check
export type HealthCheckDependency = {
  // Currently only supporting default database connection created by Sequelize.
  database?: boolean

  // Add new dependencies here
  // See https://docs.nestjs.com/recipes/terminus for examples of other type of checks
}

export interface HealthCheckOptions {
  /**
   * Global timeout in milliseconds for the health checks. Default: 1000 (1 second).
   */
  timeout?: number

  /**
   * The number of milliseconds to wait before forcefully shutting down the
   * server. Default: 1 * 60 * 1000 (1 minute).
   * Read more in official NestJS Docs: https://docs.nestjs.com/recipes/terminus#graceful-shutdown-timeout
   */
  gracefulShutdownTimeoutMs?: number

  /**
   * The dependencies to check, i.e. database connection, http endpoints etc.
   * If not provided then health check will just return ok soon as the endpoint is listening.
   */
  checks?: HealthCheckDependency
}
