import { Module } from '@nestjs/common'

import { ContentfulClientService } from './contentful-graphql-client.service'
import { ContentfulFetchProvider } from './contentful-graphql-client-fetch-provider'

@Module({
  providers: [ContentfulFetchProvider, ContentfulClientService],
  exports: [ContentfulClientService],
})
export class ContentfulClientModule {}
