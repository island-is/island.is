import { Module } from '@nestjs/common'
import { IdCardService } from './id-card.service'
import { SharedTemplateAPIModule } from '../../shared'
import { PassportsClientModule } from '@island.is/clients/passports'
import { PaymentModule } from '@island.is/application/api/payment'

@Module({
  imports: [SharedTemplateAPIModule, PassportsClientModule, PaymentModule],
  providers: [IdCardService],
  exports: [IdCardService],
})
export class IdCardModule {}
