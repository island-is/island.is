import { serviceSetup as authAdminWebSetup } from '../../../apps/services/auth-admin-api/infra/infra'
import { EnvironmentServices } from '../dsl/types/charts'


const authAdminWeb = authAdminWebSetup();
export const Services: EnvironmentServices = {
  
  prod: [
    authAdminWeb
  ],
  staging: [
    authAdminWeb
  ],
  dev: [
    authAdminWeb
  ],
}

// Services that are not included in any environment above but should be used in feature deployments
export const FeatureDeploymentServices = []
