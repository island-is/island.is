import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { HelloWorldModule } from '@island.is/api/domains/hello-world'
import { ContentSearchModule } from '@island.is/api/domains/content-search'
import { CmsModule } from '@island.is/api/domains/cms'
import { ApplicationModule } from '@island.is/api/domains/application'
import { FileUploadModule } from '@island.is/api/domains/file-upload'
import { DocumentModule } from '@island.is/api/domains/documents'

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile: 'apps/api/src/api.graphql',
      path: '/api/graphql',
    }),
    HelloWorldModule,
    ContentSearchModule,
    CmsModule,
    ApplicationModule,
    DocumentModule,
  ],
})
export class AppModule {}
