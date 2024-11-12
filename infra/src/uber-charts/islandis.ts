import { serviceSetup as apiSetup } from '../../../apps/api/infra/api'
import { serviceSetup as webSetup } from '../../../apps/web/infra/web'
import { serviceSetup as searchIndexerSetup } from '../../../apps/services/search-indexer/infra/search-indexer-service'
import { serviceSetup as contentfulEntryTaggerSetup } from '../../../apps/services/contentful-entry-tagger/infra/contentful-entry-tagger-service'
import { serviceSetup as contentfulAppsSetup } from '../../../apps/contentful-apps/infra/contentful-apps'

import {
  serviceSetup as appSystemApiSetup,
  workerSetup as appSystemApiWorkerSetup,
} from '../../../apps/application-system/api/infra/application-system-api'
import { serviceSetup as appSystemFormSetup } from '../../../apps/application-system/form/infra/application-system-form'

// Portals
import { serviceSetup as servicePortalApiSetup } from '../../../apps/services/user-profile/infra/service-portal-api'
import { serviceSetup as servicePortalSetup } from '../../../apps/portals/my-pages/infra/portals-my-pages'

import { serviceSetup as adminPortalSetup } from '../../../apps/portals/admin/infra/portals-admin'

// Payments
import { serviceSetup as paymentsWebAppServiceSetup } from '../../../apps/payments/infra/payments'
import { serviceSetup as paymentsMicroserviceServiceSetup } from '../../../apps/services/payments/infra/payments'

// Bff's
import { serviceSetup as bffAdminPortalServiceSetup } from '../../../apps/services/bff/infra/admin-portal.infra'

import { serviceSetup as consultationPortalSetup } from '../../../apps/consultation-portal/infra/samradsgatt'
import { serviceSetup as xroadCollectorSetup } from '../../../apps/services/xroad-collector/infra/xroad-collector'

import { serviceSetup as licenseApiSetup } from '../../../apps/services/license-api/infra/license-api'

import { serviceSetup as skilavottordWsSetup } from '../../../apps/skilavottord/ws/infra/skilavottord-ws'
import { serviceSetup as skilavottordWebSetup } from '../../../apps/skilavottord/web/infra/skilavottord-web'

import { serviceSetup as serviceDocumentsSetup } from '../../../apps/services/documents/infra/documents-service'
import { serviceSetup as serviceNameRegistryBackendSetup } from '../../../apps/icelandic-names-registry/backend/infra/icelandic-names-registry-backend'

import { serviceSetup as storybookSetup } from '../../../libs/island-ui/storybook/infra/storybook'

import { serviceSetup as downloadServiceSetup } from '../../../apps/download-service/infra/download-service'
import { serviceSetup as endorsementServiceSetup } from '../../../apps/services/endorsements/api/infra/endorsement-system-api'
import { serviceSetup as githubActionsCacheSetup } from '../../../apps/github-actions-cache/infra/github-actions-cache'

import {
  userNotificationServiceSetup,
  userNotificationCleanUpWorkerSetup,
  userNotificationWorkerSetup,
} from '../../../apps/services/user-notification/infra/user-notification'

import { serviceSetup as adsApiSetup } from '../../../apps/air-discount-scheme/api/infra/api'
import { serviceSetup as adsWebSetup } from '../../../apps/air-discount-scheme/web/infra/web'
import { serviceSetup as adsBackendSetup } from '../../../apps/air-discount-scheme/backend/infra/air-discount-scheme-backend'

import { serviceSetup as externalContractsTestsSetup } from '../../../apps/external-contracts-tests/infra/external-contracts-tests'

import { serviceSetup as rabBackendSetup } from '../../../apps/services/regulations-admin-backend/infra/regulations-admin-backend'

import {
  serviceSetup as universityGatewaySetup,
  workerSetup as universityGatewayWorkerSetup,
} from '../../../apps/services/university-gateway/infra/university-gateway'

import {
  serviceSetup as sessionsServiceSetup,
  workerSetup as sessionsWorkerSetup,
  cleanupSetup as sessionsCleanupWorkerSetup,
} from '../../../apps/services/sessions/infra/sessions'

import { serviceSetup as authAdminApiSetup } from '../../../apps/services/auth/admin-api/infra/auth-admin-api'

import { EnvironmentServices } from '.././dsl/types/charts'
import { ServiceBuilder } from '../dsl/dsl'

const endorsement = endorsementServiceSetup({})

const skilavottordWs = skilavottordWsSetup()
const skilavottordWeb = skilavottordWebSetup({ api: skilavottordWs })

const documentsService = serviceDocumentsSetup()
const servicePortalApi = servicePortalApiSetup()

const userNotificationService = userNotificationServiceSetup({
  userProfileApi: servicePortalApi,
})

const appSystemApi = appSystemApiSetup({
  documentsService,
  servicesEndorsementApi: endorsement,
  skilavottordWs,
  servicePortalApi,
  userNotificationService,
})
const appSystemApiWorker = appSystemApiWorkerSetup()

const adminPortal = adminPortalSetup()
const nameRegistryBackend = serviceNameRegistryBackendSetup()

const adsBackend = adsBackendSetup()
const adsApi = adsApiSetup({ adsBackend })
const adsWeb = adsWebSetup({ adsApi })
const rabBackend = rabBackendSetup()

const sessionsService = sessionsServiceSetup()
const sessionsWorker = sessionsWorkerSetup()
const sessionsCleanupWorker = sessionsCleanupWorkerSetup()

const authAdminApi = authAdminApiSetup()

const universityGatewayService = universityGatewaySetup()
const universityGatewayWorker = universityGatewayWorkerSetup()

const paymentsWebApp = paymentsWebAppServiceSetup()
const paymentsMicroservice = paymentsMicroserviceServiceSetup()

const api = apiSetup({
  appSystemApi,
  servicePortalApi,
  documentsService,
  icelandicNameRegistryBackend: nameRegistryBackend,
  servicesEndorsementApi: endorsement,
  airDiscountSchemeBackend: adsBackend,
  regulationsAdminBackend: rabBackend,
  sessionsApi: sessionsService,
  authAdminApi,
  universityGatewayApi: universityGatewayService,
  userNotificationService,
  paymentsApi: paymentsMicroservice,
})

const servicePortal = servicePortalSetup({ graphql: api })
const bffAdminPortalService = bffAdminPortalServiceSetup({ api })
const appSystemForm = appSystemFormSetup({ api })
const web = webSetup({ api })
const searchIndexer = searchIndexerSetup()
const contentfulEntryTagger = contentfulEntryTaggerSetup()
const contentfulApps = contentfulAppsSetup()
const consultationPortal = consultationPortalSetup({ api })

const xroadCollector = xroadCollectorSetup()

const licenseApi = licenseApiSetup()

const storybook = storybookSetup({})

const downloadService = downloadServiceSetup({
  regulationsAdminBackend: rabBackend,
})
const userNotificationWorkerService = userNotificationWorkerSetup({
  userProfileApi: servicePortalApi,
})
const userNotificationCleanupWorkerService =
  userNotificationCleanUpWorkerSetup()

const githubActionsCache = githubActionsCacheSetup()

const externalContractsTests = externalContractsTestsSetup()

export const Services: EnvironmentServices = {
  prod: [
    appSystemApi,
    appSystemForm,
    servicePortal,
    servicePortalApi,
    adminPortal,
    api,
    consultationPortal,
    web,
    searchIndexer,
    skilavottordWeb,
    skilavottordWs,
    documentsService,
    storybook,
    xroadCollector,
    downloadService,
    nameRegistryBackend,
    endorsement,
    adsWeb,
    adsBackend,
    adsApi,
    rabBackend,
    appSystemApiWorker,
    userNotificationService,
    userNotificationWorkerService,
    userNotificationCleanupWorkerService,
    licenseApi,
    sessionsService,
    sessionsWorker,
    sessionsCleanupWorker,
    universityGatewayService,
    universityGatewayWorker,
    contentfulApps,
    contentfulEntryTagger,
    bffAdminPortalService,
  ],
  staging: [
    appSystemApi,
    appSystemForm,
    servicePortal,
    servicePortalApi,
    adminPortal,
    api,
    consultationPortal,
    web,
    skilavottordWeb,
    skilavottordWs,
    searchIndexer,
    documentsService,
    storybook,
    xroadCollector,
    downloadService,
    nameRegistryBackend,
    endorsement,
    adsWeb,
    adsBackend,
    adsApi,
    rabBackend,
    appSystemApiWorker,
    userNotificationService,
    userNotificationWorkerService,
    userNotificationCleanupWorkerService,
    licenseApi,
    sessionsService,
    sessionsWorker,
    sessionsCleanupWorker,
    universityGatewayService,
    universityGatewayWorker,
    bffAdminPortalService,
  ],
  dev: [
    appSystemApi,
    appSystemForm,
    servicePortal,
    servicePortalApi,
    adminPortal,
    consultationPortal,
    api,
    web,
    searchIndexer,
    xroadCollector,
    skilavottordWeb,
    skilavottordWs,
    documentsService,
    storybook,
    downloadService,
    nameRegistryBackend,
    endorsement,
    adsWeb,
    adsBackend,
    adsApi,
    rabBackend,
    githubActionsCache,
    userNotificationService,
    userNotificationWorkerService,
    userNotificationCleanupWorkerService,
    externalContractsTests,
    appSystemApiWorker,
    contentfulEntryTagger,
    licenseApi,
    sessionsService,
    sessionsWorker,
    sessionsCleanupWorker,
    contentfulApps,
    universityGatewayService,
    universityGatewayWorker,
    bffAdminPortalService,
    paymentsWebApp,
    paymentsMicroservice,
  ],
}

// Services that are not included in any environment above but should be used in feature deployments
export const FeatureDeploymentServices: ServiceBuilder<any>[] = []

// Services that are included in some environment above but should be excluded from feature deployments
export const ExcludedFeatureDeploymentServices: ServiceBuilder<any>[] = [
  userNotificationService,
  userNotificationWorkerService,
  userNotificationCleanupWorkerService,
  contentfulEntryTagger,
  searchIndexer,
  contentfulApps,
  githubActionsCache,
]
