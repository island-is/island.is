import { Module } from '@nestjs/common'
import { SignatureCollectionResolver } from './signatureCollection.resolver'
import { SignatureCollectionService } from './signatureCollection.service'
import { SignatureCollectionClientModule } from '@island.is/clients/signature-collection'

@Module({
  imports: [SignatureCollectionClientModule],
  providers: [SignatureCollectionService, SignatureCollectionResolver],
})
export class SignatureCollectionModule {}
