import { Module } from '@nestjs/common'
import {
  ClientsModule,
  DelegationProviderService,
} from '@island.is/auth-api-lib'
import { ProvidersController } from './providers.controller'

@Module({
  imports: [ClientsModule],
  controllers: [ProvidersController],
  providers: [DelegationProviderService],
})
export class ProvidersModule {}
