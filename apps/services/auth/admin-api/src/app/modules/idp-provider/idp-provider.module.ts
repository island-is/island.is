import { IdpProviderModule as AuthIdpProviderModule } from '@island.is/auth-api-lib'
import { Module } from '@nestjs/common'
import { IdpProviderController } from './idp-provider.controller'

@Module({
  imports: [AuthIdpProviderModule],
  controllers: [IdpProviderController],
  providers: [],
})
export class IdpProviderModule {}
