import { serviceSetup as identityServerSetup } from '../../../apps/identity-server/infra/identity-server'
import { serviceSetup as authAdminWebSetup } from '../../../apps/auth-admin-web/infra/auth-admin-web'
import { serviceSetup as authAdminApiSetup } from '../../../apps/services/auth-admin-api/infra/auth-admin-api'
import { serviceSetup as authApiSetup } from '../../../apps/services/auth-api/infra/auth-api'
import { serviceSetup as authPublicApiSetup } from '../../../apps/services/auth-public-api/infra/auth-public-api'
import { serviceSetup as personalRepresentativeSetup } from '../../../apps/services/personal-representative/infra/personal-representative'
import { serviceSetup as personalRepresentativePublicSetup } from '../../../apps/services/personal-representative-public/infra/personal-representative-public'

import { EnvironmentServices } from '../dsl/types/charts'

const identityServer = identityServerSetup()
const authAdminWeb = authAdminWebSetup()
const authAdminApi = authAdminApiSetup()
const authApi = authApiSetup()
const authPublicApi = authPublicApiSetup()
const personalRepresentative = personalRepresentativeSetup()
const personalRepresentativePublic = personalRepresentativePublicSetup()

export const Services: EnvironmentServices = {
  prod: [
    identityServer,
    authAdminWeb,
    authAdminApi,
    authApi,
    authPublicApi,
    personalRepresentative,
    personalRepresentativePublic,
  ],
  staging: [
    identityServer,
    authAdminWeb,
    authAdminApi,
    authApi,
    authPublicApi,
    personalRepresentative,
    personalRepresentativePublic,
  ],
  dev: [
    identityServer,
    authAdminWeb,
    authAdminApi,
    authApi,
    authPublicApi,
    personalRepresentative,
    personalRepresentativePublic,
  ],
}

// Services that are not included in any environment above but should be used in feature deployments
export const FeatureDeploymentServices = []
