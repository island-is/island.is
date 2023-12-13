import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { SignatureCollectionClientService } from './signature-collection.service'
// import { AuthDelegationApiClientModule } from '@island.is/clients/auth/delegation-api'

@Module({
  providers: [
    ApiConfiguration,
    ...exportedApis,
    SignatureCollectionClientService,
  ],
  // imports: [AuthDelegationApiClientModule],
  exports: [SignatureCollectionClientService],
})
export class SignatureCollectionClientModule {}
