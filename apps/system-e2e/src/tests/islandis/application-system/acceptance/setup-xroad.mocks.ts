import { getEnvVariables } from '../../../../../../../infra/src/dsl/service-to-environment/pre-process-service'
import { EnvironmentConfig } from '../../../../../../../infra/src/dsl/types/charts'
import { Base } from '../../../../../../../infra/src/dsl/xroad'
import { env } from '../../../../support/urls'
import { resetMocks, wildcard } from '../../../../support/wire-mocks'
import { loadParentalLeaveXroadMocks } from './mocks/parentalLeave.mock'
import { loadSocialInsuranceAdministrationXroadMocks } from './mocks/socialInsuranceAdministration.mock'
import { loadNationalRegistryXroadMocks } from './mocks/nationalRegistry.mock'

export const setupXroadMocks = async () => {
  await resetMocks()

  /* Xroad mocks */
  await loadParentalLeaveXroadMocks()
  await loadSocialInsuranceAdministrationXroadMocks()
  await loadNationalRegistryXroadMocks()

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
