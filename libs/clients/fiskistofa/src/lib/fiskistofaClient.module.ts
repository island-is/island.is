import { Module } from '@nestjs/common'
import { FiskistofaClientService } from './fiskistofaClient.service'

@Module({
  providers: [FiskistofaClientService],
  exports: [FiskistofaClientService],
})
export class FiskistofaClientModule {}
