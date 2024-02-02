import { Module } from '@nestjs/common'
import { SignatureCollectionResolver } from './signatureCollection.resolver'
import { SignatureCollectionService } from './signatureCollection.service'
import { SignatureCollectionClientModule } from '@island.is/clients/signature-collection'
import { SignatureCollectionAdminService } from './signatureCollectionAdmin.service'
import { SignatureCollectionAdminResolver } from './signatureCollectionAdmin.resolver'

@Module({
  imports: [SignatureCollectionClientModule],
  providers: [
    SignatureCollectionService,
    SignatureCollectionResolver,
    SignatureCollectionAdminService,
    SignatureCollectionAdminResolver,
  ],
})
export class SignatureCollectionModule {}
