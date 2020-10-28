import { buildSchema } from '@island.is/infra-nest-server'
import { ApplicationResolver } from '@island.is/api/domains/application'
import { CmsResolver } from '@island.is/api/domains/cms'
import { ContentSearchResolver } from '@island.is/api/domains/content-search'
import { DocumentResolver } from '@island.is/api/domains/documents'
import { FileUploadResolver } from '@island.is/api/domains/file-upload'
import { TranslationsResolver } from '@island.is/api/domains/translations'
import { UserProfileResolver } from '@island.is/api/domains/user-profile'
import { NationalRegistryResolver } from '@island.is/api/domains/national-registry'
import { CommunicationsResolver } from '@island.is/api/domains/communications'
import { ApiCatalogueResolver } from '@island.is/api/domains/api-catalogue'

buildSchema({
  path: 'apps/api/src/api.graphql',
  resolvers: [
    ContentSearchResolver,
    CmsResolver,
    ApplicationResolver,
    FileUploadResolver,
    DocumentResolver,
    TranslationsResolver,
    UserProfileResolver,
    NationalRegistryResolver,
    CommunicationsResolver,
    ApiCatalogueResolver,
  ],
})
