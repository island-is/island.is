import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { DigitalTachographWorkshopCardService } from './digital-tachograph-workshop-card.service'

@Module({
  imports: [SharedTemplateAPIModule],
  providers: [DigitalTachographWorkshopCardService],
  exports: [DigitalTachographWorkshopCardService],
})
export class DigitalTachographWorkshopCardModule {}
