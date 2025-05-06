import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { SeminarsTemplateService } from './seminars.service'
import { SeminarsClientModule } from '@island.is/clients/seminars-ver'

@Module({
  imports: [SharedTemplateAPIModule, SeminarsClientModule],
  providers: [SeminarsTemplateService],
  exports: [SeminarsTemplateService],
})
export class SeminarsTemplateModule {}
