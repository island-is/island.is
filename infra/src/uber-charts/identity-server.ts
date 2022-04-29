import { serviceSetup as authAdminApiSetup } from '../../../apps/services/auth-admin-api/infra/infra'
import { EnvironmentServices } from '../dsl/types/charts'


const authAdminApi = authAdminApiSetup();
export const Services: EnvironmentServices = {
  
  prod: [
    authAdminApi
  ],
  staging: [
    authAdminApi
  ],
  dev: [
    authAdminApi
  ],
}

// Services that are not included in any environment above but should be used in feature deployments
export const FeatureDeploymentServices = []
