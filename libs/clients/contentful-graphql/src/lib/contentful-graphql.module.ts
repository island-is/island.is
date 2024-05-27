import { Module } from '@nestjs/common'

import { ContentfulGraphQLClientService } from './contentful-graphql.service'
import { ContentfulGraphQLFetchProvider } from './contentful-graphql-fetch-provider'

@Module({
  providers: [ContentfulGraphQLFetchProvider, ContentfulGraphQLClientService],
  exports: [ContentfulGraphQLClientService],
})
export class ContentfulGraphQLClientModule {}
