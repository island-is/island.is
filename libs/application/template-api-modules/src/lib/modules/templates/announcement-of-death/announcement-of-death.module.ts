import { Module } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { AnnouncementOfDeathService } from './announcement-of-death.service'
import { SharedTemplateAPIModule } from '../../shared'

@Module({
  imports: [SyslumennClientModule, SharedTemplateAPIModule],
  providers: [AnnouncementOfDeathService],
  exports: [AnnouncementOfDeathService],
})
export class AnnouncementOfDeathModule {}
