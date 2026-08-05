import { Module } from '@nestjs/common'

import { GrantTypeModule } from '@island.is/auth-api-lib'

import { MeGrantTypesController } from './me-grant-types.controller'

@Module({
  imports: [GrantTypeModule],
  controllers: [MeGrantTypesController],
})
export class GrantTypesV2Module {}
