import { Module } from '@nestjs/common'

import { ResourcesModule } from '@island.is/auth-api-lib'

import { MeTenantsController } from './me-tenants.controller'
import { PublicTenantsController } from './public-tenants.controller'

@Module({
  imports: [ResourcesModule],
  controllers: [MeTenantsController, PublicTenantsController],
  providers: [],
})
export class TenantsModule {}
