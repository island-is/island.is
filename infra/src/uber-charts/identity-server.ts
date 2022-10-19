import { serviceSetup as identityServerSetup } from '../../../apps/services/auth/ids-api/infra/identity-server'
import { serviceSetup as authAdminWebSetup } from '../../../apps/auth-admin-web/infra/auth-admin-web'
import { serviceSetup as authAdminApiSetup } from '../../../apps/services/auth/admin-api/infra/auth-admin-api'
import { serviceSetup as authIdsApiSetup } from '../../../apps/services/auth/ids-api/infra/ids-api'
import { serviceSetup as authPublicApiSetup } from '../../../apps/services/auth/public-api/infra/auth-public-api'
import { serviceSetup as authDelegationApiSetup } from '../../../apps/services/auth/delegation-api/infra/delegation-api'
import { serviceSetup as personalRepresentativeSetup } from '../../../apps/services/auth/personal-representative/infra/personal-representative'
import { serviceSetup as personalRepresentativePublicSetup } from '../../../apps/services/auth/personal-representative-public/infra/personal-representative-public'

import { EnvironmentServices } from '../dsl/types/charts'

const authIdsApi = authIdsApiSetup()
const identityServer = identityServerSetup({ authIdsApi })
const authAdminWeb = authAdminWebSetup()
const authAdminApi = authAdminApiSetup()
const authPublicApi = authPublicApiSetup()
const authDelegationApi = authDelegationApiSetup()
const personalRepresentative = personalRepresentativeSetup()
const personalRepresentativePublic = personalRepresentativePublicSetup()

export const Services: EnvironmentServices = {
  prod: [
    identityServer,
    authAdminWeb,
    authAdminApi,
    authIdsApi,
    authPublicApi,
    authDelegationApi,
    personalRepresentative,
    personalRepresentativePublic,
  ],
  staging: [
    identityServer,
    authAdminWeb,
    authAdminApi,
    authIdsApi,
    authPublicApi,
    authDelegationApi,
    personalRepresentative,
    personalRepresentativePublic,
  ],
  dev: [
    identityServer,
    authAdminWeb,
    authAdminApi,
    authIdsApi,
    authPublicApi,
    authDelegationApi,
    personalRepresentative,
    personalRepresentativePublic,
  ],
}

// Services that are not included in any environment above but should be used in feature deployments
export const FeatureDeploymentServices = []
