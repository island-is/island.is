import { Module } from '@nestjs/common'
import { FiskistofaApi } from './api'
import { FiskistofaClientService } from './fiskistofaClient.service'

@Module({
  providers: [FiskistofaClientService, FiskistofaApi],
  exports: [FiskistofaClientService],
})
export class FiskistofaClientModule {}
