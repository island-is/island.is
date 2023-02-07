import { serviceSetup as apiSetup } from '../../../apps/api/infra/api'
import { serviceSetup as webSetup } from '../../../apps/web/infra/web'
import { serviceSetup as searchIndexerSetup } from '../../../apps/services/search-indexer/infra/search-indexer-service'
import { serviceSetup as contentfulEntryTaggerSetup } from '../../../apps/services/contentful-entry-tagger/infra/contentful-entry-tagger-service'

import {
  serviceSetup as appSystemApiSetup,
  workerSetup as appSystemApiWorkerSetup,
} from '../../../apps/application-system/api/infra/application-system-api'
import { serviceSetup as appSystemFormSetup } from '../../../apps/application-system/form/infra/application-system-form'

import { serviceSetup as servicePortalApiSetup } from '../../../apps/services/user-profile/infra/service-portal-api'
import { serviceSetup as servicePortalSetup } from '../../../apps/service-portal/infra/service-portal'

import { serviceSetup as adminPortalSetup } from '../../../apps/portals/admin/infra/portals-admin'
import { serviceSetup as samradsgattSetup } from '../../../apps/samradsgatt/infra/samradsgatt'
import { serviceSetup as xroadCollectorSetup } from '../../../apps/services/xroad-collector/infra/xroad-collector'

import { serviceSetup as skilavottordWsSetup } from '../../../apps/skilavottord/ws/infra/ws'
import { serviceSetup as skilavottordWebSetup } from '../../../apps/skilavottord/web/infra/web'

import { serviceSetup as serviceDocumentsSetup } from '../../../apps/services/documents/infra/documents-service'
import { serviceSetup as serviceNameRegistryBackendSetup } from '../../../apps/icelandic-names-registry/backend/infra/icelandic-names-registry-backend'

import { serviceSetup as storybookSetup } from '../../../libs/island-ui/storybook/infra/storybook'
import { serviceSetup as contentfulTranslationExtensionSetup } from '../../../libs/contentful-extensions/translation/infra/contentful-translation-extension'

import { serviceSetup as downloadServiceSetup } from '../../../apps/download-service/infra/download-service'
import { serviceSetup as endorsementServiceSetup } from '../../../apps/services/endorsements/api/infra/endorsement-system-api'
import { serviceSetup as githubActionsCacheSetup } from '../../../apps/github-actions-cache/infra/github-actions-cache'

import {
  userNotificationServiceSetup,
  userNotificationWorkerSetup,
} from '../../../apps/services/user-notification/infra/user-notification'

import { serviceSetup as adsApiSetup } from '../../../apps/air-discount-scheme/api/infra/api'
import { serviceSetup as adsWebSetup } from '../../../apps/air-discount-scheme/web/infra/web'
import { serviceSetup as adsBackendSetup } from '../../../apps/air-discount-scheme/backend/infra/backend'

import { serviceSetup as externalContractsTestsSetup } from '../../../apps/external-contracts-tests/infra/external-contracts-tests'

import {
  serviceSetup as sessionsServiceSetup,
  workerSetup as sessionsWorkerSetup,
} from '../../../apps/services/sessions/infra/sessions'

import { EnvironmentServices } from '.././dsl/types/charts'
import { ServiceBuilder } from '../dsl/dsl'

const endorsement = endorsementServiceSetup({})

const documentsService = serviceDocumentsSetup()
const appSystemApi = appSystemApiSetup({
  documentsService,
  servicesEndorsementApi: endorsement,
})
const appSystemApiWorker = appSystemApiWorkerSetup()

const servicePortalApi = servicePortalApiSetup()
const adminPortal = adminPortalSetup()
const samradsgatt = samradsgattSetup()
const nameRegistryBackend = serviceNameRegistryBackendSetup()

const adsBackend = adsBackendSetup()
const adsApi = adsApiSetup({ adsBackend })
const adsWeb = adsWebSetup({ adsApi })

const api = apiSetup({
  appSystemApi,
  servicePortalApi,
  documentsService,
  icelandicNameRegistryBackend: nameRegistryBackend,
  servicesEndorsementApi: endorsement,
  airDiscountSchemeBackend: adsBackend,
})
const servicePortal = servicePortalSetup({ graphql: api })
const appSystemForm = appSystemFormSetup({ api: api })
const web = webSetup({ api: api })
const searchIndexer = searchIndexerSetup()
const contentfulEntryTagger = contentfulEntryTaggerSetup()

const xroadCollector = xroadCollectorSetup()

const skilavottordWs = skilavottordWsSetup()
const skilavottordWeb = skilavottordWebSetup({ api: skilavottordWs })

const storybook = storybookSetup({})
const contentfulTranslationExtension = contentfulTranslationExtensionSetup()

const downloadService = downloadServiceSetup()

const userNotificationService = userNotificationServiceSetup()
const userNotificationWorkerService = userNotificationWorkerSetup({
  userProfileApi: servicePortalApi,
})

const githubActionsCache = githubActionsCacheSetup()

const externalContractsTests = externalContractsTestsSetup()

const sessionsService = sessionsServiceSetup()
const sessionsWorker = sessionsWorkerSetup()

export const Services: EnvironmentServices = {
  prod: [
    appSystemApi,
    appSystemForm,
    servicePortal,
    servicePortalApi,
    adminPortal,
    api,
    web,
    searchIndexer,
    skilavottordWeb,
    skilavottordWs,
    documentsService,
    storybook,
    contentfulTranslationExtension,
    xroadCollector,
    downloadService,
    nameRegistryBackend,
    endorsement,
    adsWeb,
    adsBackend,
    adsApi,
    appSystemApiWorker,
    userNotificationService,
    userNotificationWorkerService,
    sessionsService,
    sessionsWorker,
  ],
  staging: [
    appSystemApi,
    appSystemForm,
    servicePortal,
    servicePortalApi,
    adminPortal,
    api,
    web,
    skilavottordWeb,
    skilavottordWs,
    searchIndexer,
    documentsService,
    storybook,
    contentfulTranslationExtension,
    xroadCollector,
    downloadService,
    nameRegistryBackend,
    endorsement,
    adsWeb,
    adsBackend,
    adsApi,
    appSystemApiWorker,
    userNotificationService,
    userNotificationWorkerService,
    sessionsService,
    sessionsWorker,
  ],
  dev: [
    appSystemApi,
    appSystemForm,
    servicePortal,
    servicePortalApi,
    adminPortal,
    samradsgatt,
    api,
    web,
    searchIndexer,
    xroadCollector,
    skilavottordWeb,
    skilavottordWs,
    documentsService,
    storybook,
    contentfulTranslationExtension,
    downloadService,
    nameRegistryBackend,
    endorsement,
    adsWeb,
    adsBackend,
    adsApi,
    githubActionsCache,
    userNotificationService,
    userNotificationWorkerService,
    externalContractsTests,
    appSystemApiWorker,
    contentfulEntryTagger,
    sessionsService,
    sessionsWorker,
  ],
}

// Services that are not included in any environment above but should be used in feature deployments
export const FeatureDeploymentServices: ServiceBuilder<any>[] = []

// Services that are included in some environment above but should be excluded from feature deployments
export const ExcludedFeatureDeploymentServices: ServiceBuilder<any>[] = [
  userNotificationService,
  userNotificationWorkerService,
  contentfulEntryTagger,
  searchIndexer,
]
