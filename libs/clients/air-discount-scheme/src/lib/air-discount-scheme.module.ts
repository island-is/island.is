import { IdsClientConfig } from '@island.is/nest/config'
import { Module } from '@nestjs/common'
import { UsersApiProvider, AdminApiProvider } from './api-providers'

@Module({
  imports: [IdsClientConfig.registerOptional()],
  providers: [UsersApiProvider, AdminApiProvider],
  exports: [UsersApiProvider, AdminApiProvider],
})
export class AirDiscountSchemeClientModule {}
