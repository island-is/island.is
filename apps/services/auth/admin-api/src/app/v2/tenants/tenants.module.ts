import { Module } from '@nestjs/common'

import { ResourcesModule } from '@island.is/auth-api-lib'

import { MeTenantsController } from './me-tenants.controller'

@Module({
  imports: [ResourcesModule],
  controllers: [MeTenantsController],
  providers: [],
})
export class TenantsModule {}
