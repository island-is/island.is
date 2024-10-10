import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { DigitalTachographCompanyCardService } from './digital-tachograph-company-card.service'

@Module({
  imports: [SharedTemplateAPIModule],
  providers: [DigitalTachographCompanyCardService],
  exports: [DigitalTachographCompanyCardService],
})
export class DigitalTachographCompanyCardModule {}
