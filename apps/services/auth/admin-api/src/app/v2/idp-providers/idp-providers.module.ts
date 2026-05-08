import { Module } from '@nestjs/common'

import { IdpProviderModule } from '@island.is/auth-api-lib'

import { MeIdpProvidersController } from './me-idp-providers.controller'

@Module({
  imports: [IdpProviderModule],
  controllers: [MeIdpProvidersController],
})
export class IdpProvidersV2Module {}
