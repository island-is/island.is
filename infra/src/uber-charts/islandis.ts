import { serviceSetup as apiSetup } from '../../../apps/api/infra/api'
import { serviceSetup as webSetup } from '../../../apps/web/infra/web'
import { serviceSetup as searchIndexerSetup } from '../../../apps/services/search-indexer/infra/search-indexer-service'

import { serviceSetup as appSystemApiSetup } from '../../../apps/application-system/api/infra/application-system-api'
import { serviceSetup as appSystemFormSetup } from '../../../apps/application-system/form/infra/application-system-form'

import { serviceSetup as servicePortalApiSetup } from '../../../apps/services/user-profile/infra/service-portal-api'
import { serviceSetup as servicePortalSetup } from '../../../apps/service-portal/infra/service-portal'

import { serviceSetup as xroadCollectorSetup } from '../../../apps/services/xroad-collector/infra/xroad-collector'

import { serviceSetup as skilavottordWsSetup } from '../../../apps/skilavottord/ws/infra/ws'
import { serviceSetup as skilavottordWebSetup } from '../../../apps/skilavottord/web/infra/web'

import { serviceSetup as serviceDocumentsSetup } from '../../../apps/services/documents/infra/documents-service'
import { serviceSetup as serviceNameRegistryBackendSetup } from '../../../apps/icelandic-names-registry/backend/infra/icelandic-names-registry-backend'

import { serviceSetup as storybookSetup } from '../../../libs/island-ui/storybook/infra/storybook'
import { serviceSetup as contentfulTranslationExtensionSetup } from '../../../libs/contentful-extensions/translation/infra/contentful-translation-extension'

import { serviceSetup as downloadServiceSetup } from '../../../apps/download-service/infra/download-service'
import { serviceSetup as endorsementServiceSetup } from '../../../apps/services/endorsements/api/infra/endorsement-system-api'
import { serviceSetup as endorsementServiceUpdateMetadataSetup } from '../../../apps/services/endorsements/api/infra/endorsement-system-scripts-update-metadata'
import { serviceSetup as partyLetterServiceSetup } from '../../../apps/services/party-letter-registry-api/infra/party-letter-registry-api'
import { serviceSetup as temporaryVoterRegistryServiceSetup } from '../../../apps/services/temporary-voter-registry-api/infra/temporary-voter-registry-api'

import { serviceSetup as adsApiSetup } from '../../../apps/air-discount-scheme/api/infra/api'
import { serviceSetup as adsWebSetup } from '../../../apps/air-discount-scheme/web/infra/web'
import { serviceSetup as adsBackendSetup } from '../../../apps/air-discount-scheme/backend/infra/backend'

import { EnvironmentServices } from '.././dsl/types/charts'

const temporaryVoterRegistry = temporaryVoterRegistryServiceSetup()
const partyLetterRegistry = partyLetterServiceSetup()
const endorsement = endorsementServiceSetup({
  servicesTemporaryVoterRegistryApi: temporaryVoterRegistry,
})
const endorsementUpdateMetadata = endorsementServiceUpdateMetadataSetup({
  servicesTemporaryVoterRegistryApi: temporaryVoterRegistry,
})

const documentsService = serviceDocumentsSetup()
const appSystemApi = appSystemApiSetup({
  documentsService,
  servicesEndorsementApi: endorsement,
  servicesPartyLetterRegistryApi: partyLetterRegistry,
})
const appSystemForm = appSystemFormSetup({})

const servicePortalApi = servicePortalApiSetup()
const servicePortal = servicePortalSetup({})
const nameRegistryBackend = serviceNameRegistryBackendSetup()
const api = apiSetup({
  appSystemApi,
  servicePortalApi,
  documentsService,
  icelandicNameRegistryBackend: nameRegistryBackend,
  servicesEndorsementApi: endorsement,
  servicesPartyLetterRegistryApi: partyLetterRegistry,
  servicesTemporaryVoterRegistryApi: temporaryVoterRegistry,
})
const web = webSetup({ api: api })
const searchIndexer = searchIndexerSetup()

const xroadCollector = xroadCollectorSetup()

const skilavottordWs = skilavottordWsSetup()
const skilavottordWeb = skilavottordWebSetup({ api: skilavottordWs })

const storybook = storybookSetup({})
const contentfulTranslationExtension = contentfulTranslationExtensionSetup()

const downloadService = downloadServiceSetup()

const adsBackend = adsBackendSetup()
const adsApi = adsApiSetup({ adsBackend })
const adsWeb = adsWebSetup({ adsApi })

export const Services: EnvironmentServices = {
  prod: [
    appSystemApi,
    appSystemForm,
    servicePortal,
    servicePortalApi,
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
    partyLetterRegistry,
    temporaryVoterRegistry,
    endorsementUpdateMetadata,
    adsWeb,
    adsBackend,
    adsApi,
  ],
  staging: [
    appSystemApi,
    appSystemForm,
    servicePortal,
    servicePortalApi,
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
    partyLetterRegistry,
    temporaryVoterRegistry,
    endorsementUpdateMetadata,
    adsWeb,
    adsBackend,
    adsApi,
  ],
  dev: [
    appSystemApi,
    appSystemForm,
    servicePortal,
    servicePortalApi,
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
    partyLetterRegistry,
    temporaryVoterRegistry,
    endorsementUpdateMetadata,
    adsWeb,
    adsBackend,
    adsApi,
  ],
}

export const FeatureDeploymentServices = []
