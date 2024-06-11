import { Module } from '@nestjs/common'
import { ContentfulGraphQLClientService } from './cms-client.service'
import { ContentfulGraphQLFetchProvider } from './cms-client-fetch-provider'

@Module({
  providers: [ContentfulGraphQLFetchProvider, ContentfulGraphQLClientService],
  exports: [ContentfulGraphQLClientService],
})
export class ContentfulGraphQLClientModule {}
