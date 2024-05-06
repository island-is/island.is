import { serviceSetup as authAdminWebSetup } from '../../../apps/auth-admin-web/infra/auth-admin-web'
import { serviceSetup as authAdminApiSetup } from '../../../apps/services/auth/admin-api/infra/auth-admin-api'
import { serviceSetup as authDelegationApiSetup } from '../../../apps/services/auth/delegation-api/infra/delegation-api'
import { serviceSetup as identityServerSetup } from '../../../apps/services/auth/ids-api/infra/identity-server'
import {
  cleanupSetup as authIdsApiCleanupWorkerSetup,
  serviceSetup as authIdsApiSetup,
} from '../../../apps/services/auth/ids-api/infra/ids-api'
import { serviceSetup as personalRepresentativePublicSetup } from '../../../apps/services/auth/personal-representative-public/infra/personal-representative-public'
import { serviceSetup as personalRepresentativeSetup } from '../../../apps/services/auth/personal-representative/infra/personal-representative'
import { serviceSetup as authPublicApiSetup } from '../../../apps/services/auth/public-api/infra/auth-public-api'
import { userNotificationServiceSetup } from '../../../apps/services/user-notification/infra/user-notification'
import { serviceSetup as userProfileApiSetup } from '../../../apps/services/user-profile/infra/service-portal-api'
import { EnvironmentServices } from '../dsl/types/charts'

const userProfileApi = userProfileApiSetup()
const userNotification = userNotificationServiceSetup({
  userProfileApi,
})

const authIdsApi = authIdsApiSetup()
const identityServer = identityServerSetup({ authIdsApi })
const authAdminWeb = authAdminWebSetup()
const authAdminApi = authAdminApiSetup()
const authPublicApi = authPublicApiSetup()
const authDelegationApi = authDelegationApiSetup({
  userNotification,
})
const personalRepresentative = personalRepresentativeSetup()
const personalRepresentativePublic = personalRepresentativePublicSetup()

const authIdsApiCleanupWorker = authIdsApiCleanupWorkerSetup()

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
    authIdsApiCleanupWorker,
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
    authIdsApiCleanupWorker,
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
    authIdsApiCleanupWorker,
  ],
}

// Services that are not included in any environment above but should be used in feature deployments
export const FeatureDeploymentServices = []
