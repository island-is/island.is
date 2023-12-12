import { PCardClientModule } from '@island.is/clients/p-card'
import { PCardClient } from './pCardClient.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [PCardClientModule],
  providers: [PCardClient],
  exports: [PCardClient],
})
export class PCardModule {}
