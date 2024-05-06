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

export type MockType =
  | 'assets'
  | 'health-insurance'
  | 'social-insurance'
  | 'licenses'
  | 'occupational-licenses'

export const Mocks: Record<MockType, () => void> = {
  assets: loadAssetsXroadMocks,
  'health-insurance': loadHealthInsuranceXroadMocks,
  'social-insurance': loadSocialInsuranceXroadMocks,
  licenses: loadLicensesXroadMocks,
  'occupational-licenses': loadOccupationalLicensesXroadMocks,
}

export const setupXroadMocks = async (types?: Array<MockType>) => {
  await resetMocks()

  if (!types) {
    await Promise.all(Object.values(Mocks).map((m) => m()))
  } else {
    await Promise.all(types.map((m) => Mocks[m]()))
  }

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
