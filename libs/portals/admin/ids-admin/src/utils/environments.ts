import { AuthAdminEnvironment } from '@island.is/api/schema'

export const authAdminEnvironments = [
  AuthAdminEnvironment.Development,
  AuthAdminEnvironment.Staging,
  AuthAdminEnvironment.Production,
]

/**
 * Pick the best environment to display: prefer the currently selected
 * environment if it's available, otherwise fall back to the highest
 * available (Production > Staging > Development).
 */
export const pickBestEnvironment = (
  currentEnv: AuthAdminEnvironment,
  availableEnvironments: AuthAdminEnvironment[],
): AuthAdminEnvironment | undefined =>
  availableEnvironments.includes(currentEnv)
    ? currentEnv
    : [...authAdminEnvironments]
        .reverse()
        .find((env) => availableEnvironments.includes(env))
