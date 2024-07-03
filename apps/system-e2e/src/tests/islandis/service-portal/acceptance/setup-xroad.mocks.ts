import { resetMocks, wildcard } from '../../../../support/wire-mocks'
import { Base } from '../../../../../../../infra/src/dsl/xroad'
import { env } from '../../../../support/urls'
import { getEnvVariables } from '../../../../../../../infra/src/dsl/service-to-environment/pre-process-service'
import { EnvironmentConfig } from '../../../../../../../infra/src/dsl/types/charts'
import { loadAssetsXroadMocks } from './mocks/assets.mock'
import { loadHealthInsuranceXroadMocks } from './mocks/healthInsurance.mock'
import { loadSocialInsuranceXroadMocks } from './mocks/socialInsurance.mock'
import { loadLicensesXroadMocks } from './mocks/licenses.mock'
import { loadOccupationalLicensesXroadMocks } from './mocks/occupationalLicenses.mock'

export const setupXroadMocks = async () => {
  await resetMocks()

  /** Xroad mocks */
  await Promise.all([
    loadAssetsXroadMocks().catch((error) => ({ error })),
    loadHealthInsuranceXroadMocks().catch((error) => ({ error })),
    loadSocialInsuranceXroadMocks().catch((error) => ({ error })),
    loadLicensesXroadMocks().catch((error) => ({ error })),
    loadOccupationalLicensesXroadMocks().catch((error) => ({ error })),
  ])

  const { envs } = getEnvVariables(Base.getEnv(), 'system-e2e', env)
  const xroadBasePath = envs['XROAD_BASE_PATH']
  const path =
    typeof xroadBasePath === 'string'
      ? xroadBasePath
      : xroadBasePath({
          svc: (args) => {
            return args as string
          },
          env: {} as EnvironmentConfig,
        })
  await wildcard(path)
}
