import { Module } from '@nestjs/common'
import { DocumentProviderResolver } from './document-provider.resolver'
import { DocumentProviderService } from './document-provider.service'

@Module({
  providers: [DocumentProviderResolver, DocumentProviderService],
  exports: [],
})
export class DocumentProviderModule {}
