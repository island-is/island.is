import { buildSchema } from '@island.is/infra-nest-server'
import { ApplicationResolver } from '@island.is/api/domains/application'
import { CmsResolver } from '@island.is/api/domains/cms'
import { ContentSearchResolver } from '@island.is/api/domains/content-search'
import { DocumentResolver } from '@island.is/api/domains/documents'
import { FileUploadResolver } from '@island.is/api/domains/file-upload'
import { TranslationsResolver } from '@island.is/api/domains/translations'

buildSchema({
  path: 'apps/api/src/api.graphql',
  resolvers: [
    ContentSearchResolver,
    CmsResolver,
    ApplicationResolver,
    FileUploadResolver,
    DocumentResolver,
    TranslationsResolver,
  ],
})
