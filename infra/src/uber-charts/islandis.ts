import { serviceSetup as apiSetup } from '../../../apps/api/infra/api'
import { serviceSetup as contentfulAppsSetup } from '../../../apps/contentful-apps/infra/contentful-apps'
import { serviceSetup as contentfulEntryTaggerSetup } from '../../../apps/services/contentful-entry-tagger/infra/contentful-entry-tagger-service'
import { serviceSetup as searchIndexerSetup } from '../../../apps/services/search-indexer/infra/search-indexer-service'
import { serviceSetup as webSetup } from '../../../apps/web/infra/web'

import {
  serviceSetup as appSystemApiSetup,
  workerSetup as appSystemApiWorkerSetup,
} from '../../../apps/application-system/api/infra/application-system-api'
import { serviceSetup as appSystemFormSetup } from '../../../apps/application-system/form/infra/application-system-form'

// Portals
import { serviceSetup as adminPortalSetup } from '../../../apps/portals/admin/infra/portals-admin'
import { serviceSetup as servicePortalSetup } from '../../../apps/portals/my-pages/infra/portals-my-pages'
import { serviceSetup as servicePortalApiSetup } from '../../../apps/services/user-profile/infra/service-portal-api'

// Payments
import { serviceSetup as paymentsWebSetup } from '../../../apps/payments/infra/payments'
import { serviceSetup as paymentsServiceSetup } from '../../../apps/services/payments/infra/payments'

// Bff's
import { serviceSetup as bffAdminPortalServiceSetup } from '../../../apps/services/bff/infra/admin-portal.infra'
import { serviceSetup as bffServicePortalServiceSetup } from '../../../apps/services/bff/infra/my-pages-portal.infra'

import { serviceSetup as consultationPortalSetup } from '../../../apps/consultation-portal/infra/samradsgatt'
import { serviceSetup as xroadCollectorSetup } from '../../../apps/services/xroad-collector/infra/xroad-collector'

import { serviceSetup as licenseApiSetup } from '../../../apps/services/license-api/infra/license-api'
import { workerSetup as cmsImporterSetup } from '../../../apps/services/cms-importer/infra/cms-importer-worker'

import { serviceSetup as skilavottordWebSetup } from '../../../apps/skilavottord/web/infra/skilavottord-web'
import { serviceSetup as skilavottordWsSetup } from '../../../apps/skilavottord/ws/infra/skilavottord-ws'

import { serviceSetup as serviceNameRegistryBackendSetup } from '../../../apps/icelandic-names-registry/backend/infra/icelandic-names-registry-backend'
import { serviceSetup as serviceDocumentsSetup } from '../../../apps/services/documents/infra/documents-service'

import { serviceSetup as storybookSetup } from '../../../libs/island-ui/storybook/infra/storybook'

import { serviceSetup as downloadServiceSetup } from '../../../apps/download-service/infra/download-service'
import { serviceSetup as githubActionsCacheSetup } from '../../../apps/github-actions-cache/infra/github-actions-cache'
import { serviceSetup as endorsementServiceSetup } from '../../../apps/services/endorsements/api/infra/endorsement-system-api'

import {
  userNotificationCleanUpWorkerSetup,
  userNotificationServiceSetup,
  userNotificationWorkerSetup,
  userNotificationBirthdayWorkerSetup,
} from '../../../apps/services/user-notification/infra/user-notification'

import { serviceSetup as adsApiSetup } from '../../../apps/air-discount-scheme/api/infra/api'
import { serviceSetup as adsBackendSetup } from '../../../apps/air-discount-scheme/backend/infra/air-discount-scheme-backend'
import { serviceSetup as adsWebSetup } from '../../../apps/air-discount-scheme/web/infra/web'

import { serviceSetup as rabBackendSetup } from '../../../apps/services/regulations-admin-backend/infra/regulations-admin-backend'

import {
  serviceSetup as universityGatewaySetup,
  workerSetup as universityGatewayWorkerSetup,
} from '../../../apps/services/university-gateway/infra/university-gateway'

import {
  cleanupSetup as sessionsCleanupWorkerSetup,
  serviceSetup as sessionsServiceSetup,
  workerSetup as sessionsWorkerSetup,
} from '../../../apps/services/sessions/infra/sessions'

import { serviceSetup as authAdminApiSetup } from '../../../apps/services/auth/admin-api/infra/auth-admin-api'

import { EnvironmentServices } from '.././dsl/types/charts'
import { ServiceBuilder } from '../dsl/dsl'
import { serviceSetup as formSystemApiSetup } from '../../../apps/services/form-system/infra/form-system'
import { workerSetup as formSystemWorkerSetup } from '../../../apps/services/form-system/infra/form-system'
import { serviceSetup as formSystemWebSetup } from '../../../apps/form-system/web/infra/form-system-web'
import { serviceSetup as paymentFlowUpdateHandlerSetup } from '../../../apps/services/payment-flow-update-handler/infra/payment-flow-update-handler'

const endorsement = endorsementServiceSetup({})

const skilavottordWs = skilavottordWsSetup()
const skilavottordWeb = skilavottordWebSetup({ api: skilavottordWs })

const documentsService = serviceDocumentsSetup()
const servicePortalApi = servicePortalApiSetup()
const paymentsService = paymentsServiceSetup()

const userNotificationService = userNotificationServiceSetup({
  userProfileApi: servicePortalApi,
})

const appSystemApi = appSystemApiSetup({
  documentsService,
  servicesEndorsementApi: endorsement,
  skilavottordWs,
  servicePortalApi,
  userNotificationService,
  paymentsApi: paymentsService,
})
const appSystemApiWorker = appSystemApiWorkerSetup({
  userNotificationService,
  paymentsApi: paymentsService,
})

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

const formSystemApi = formSystemApiSetup()
const formSystemWorker = formSystemWorkerSetup()
const formSystemWeb = formSystemWebSetup()

const paymentFlowUpdateHandlerService = paymentFlowUpdateHandlerSetup()

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
  paymentsApi: paymentsService,
  formSystemService: formSystemApi,
  paymentFlowUpdateHandlerService,
})

const adminPortal = adminPortalSetup()
const servicePortal = servicePortalSetup()
const bffAdminPortalService = bffAdminPortalServiceSetup({ api })
const bffServicePortalService = bffServicePortalServiceSetup({ api })
const paymentsWebApp = paymentsWebSetup({
  api,
})

const appSystemForm = appSystemFormSetup()
const web = webSetup({ api })
const searchIndexer = searchIndexerSetup()
const contentfulEntryTagger = contentfulEntryTaggerSetup()
const contentfulApps = contentfulAppsSetup()
const consultationPortal = consultationPortalSetup({ api })

const xroadCollector = xroadCollectorSetup()

const licenseApi = licenseApiSetup()
const cmsImporter = cmsImporterSetup()

const storybook = storybookSetup({})

const downloadService = downloadServiceSetup({
  regulationsAdminBackend: rabBackend,
})
const userNotificationWorkerService = userNotificationWorkerSetup({
  userProfileApi: servicePortalApi,
})
const userNotificationCleanupWorkerService =
  userNotificationCleanUpWorkerSetup()

const userNotificationBirthdayWorkerService =
  userNotificationBirthdayWorkerSetup({ userProfileApi: servicePortalApi })

const githubActionsCache = githubActionsCacheSetup()

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
    userNotificationBirthdayWorkerService,
    licenseApi,
    cmsImporter,
    sessionsService,
    sessionsWorker,
    sessionsCleanupWorker,
    universityGatewayService,
    universityGatewayWorker,
    contentfulApps,
    contentfulEntryTagger,
    bffAdminPortalService,
    bffServicePortalService,
    paymentsWebApp,
    paymentsService,
    paymentFlowUpdateHandlerService,
    formSystemApi,
    formSystemWeb,
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
    userNotificationBirthdayWorkerService,
    licenseApi,
    cmsImporter,
    sessionsService,
    sessionsWorker,
    sessionsCleanupWorker,
    universityGatewayService,
    universityGatewayWorker,
    bffServicePortalService,
    bffAdminPortalService,
    paymentsWebApp,
    paymentsService,
    paymentFlowUpdateHandlerService,
    formSystemApi,
    formSystemWeb,
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
    userNotificationBirthdayWorkerService,
    appSystemApiWorker,
    contentfulEntryTagger,
    cmsImporter,
    licenseApi,
    sessionsService,
    sessionsWorker,
    sessionsCleanupWorker,
    contentfulApps,
    universityGatewayService,
    universityGatewayWorker,
    bffAdminPortalService,
    paymentsWebApp,
    paymentsService,
    bffServicePortalService,
    formSystemApi,
    formSystemWorker,
    formSystemWeb,
    paymentFlowUpdateHandlerService,
  ],
}

// Services that are not included in any environment above but should be used in feature deployments
export const FeatureDeploymentServices: ServiceBuilder<any>[] = []

// Services that are included in some environment above but should be excluded from feature deployments
export const ExcludedFeatureDeploymentServices: ServiceBuilder<any>[] = [
  userNotificationService,
  userNotificationWorkerService,
  userNotificationCleanupWorkerService,
  userNotificationBirthdayWorkerService,
  contentfulEntryTagger,
  searchIndexer,
  contentfulApps,
  githubActionsCache,
  xroadCollector,
  nameRegistryBackend,
]
