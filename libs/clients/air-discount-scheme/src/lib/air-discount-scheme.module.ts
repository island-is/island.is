import { Module } from '@nestjs/common'

import { IdsClientConfig } from '@island.is/nest/config'

import { AirDiscountSchemeClientService } from './airDiscountSchemeClient.service'
import { AdminApiProvider,UsersApiProvider } from './api-providers'

@Module({
  imports: [IdsClientConfig.registerOptional()],
  providers: [
    UsersApiProvider,
    AdminApiProvider,
    AirDiscountSchemeClientService,
  ],
  exports: [UsersApiProvider, AdminApiProvider, AirDiscountSchemeClientService],
})
export class AirDiscountSchemeClientModule {}
