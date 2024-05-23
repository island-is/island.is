
import { Module } from '@nestjs/common';
import { ContentfulClientService } from './contentfulClient.service';
import { ContentfulFetchProvider } from './contentfulFetchProvider';

@Module({
  providers: [ContentfulFetchProvider, ContentfulClientService],
  exports: [ContentfulClientService],
})
export class ContentfulClientModule {}
