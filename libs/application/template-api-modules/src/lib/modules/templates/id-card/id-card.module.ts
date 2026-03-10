import { Module } from '@nestjs/common'
import { IdCardService } from './id-card.service'
import { SharedTemplateAPIModule } from '../../shared'
import { PassportsClientModule } from '@island.is/clients/passports'
import { ClientsPaymentsModule } from '@island.is/clients/payments'

@Module({
  imports: [
    SharedTemplateAPIModule,
    PassportsClientModule,
    ClientsPaymentsModule,
  ],
  providers: [IdCardService],
  exports: [IdCardService],
})
export class IdCardModule {}
