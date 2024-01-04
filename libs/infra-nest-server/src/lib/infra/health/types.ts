export const HealthCheckOptionsProviderKey = 'HealthCheckOptions'

export interface HealthCheckOptions {
  /**
   * Global timeout in milliseconds for the health checks. Default: 1000 (1 second).
   */
  timeout?: number

  /**
   * The dependencies to check, i.e. database connection, http endpoints etc.
   */

  // Currently only supporting default database connection created by Sequelize.
  database?: boolean

  /**
   * Add new dependencies here
   * See https://docs.nestjs.com/recipes/terminus for examples of other type of checks
   */
}
