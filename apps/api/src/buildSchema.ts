import { buildSchema } from '@island.is/infra-nest-server'
import { ApplicationResolver } from '@island.is/api/domains/application'
import {
  ArticleResolver,
  CmsResolver,
  LatestNewsSliceResolver,
} from '@island.is/api/domains/cms'
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
    ArticleResolver,
    LatestNewsSliceResolver,
    ApplicationResolver,
    FileUploadResolver,
    DocumentResolver,
    TranslationsResolver,
    NationalRegistryResolver,
    UserProfileResolver,
    CommunicationsResolver,
    ApiCatalogueResolver,
  ],
})
