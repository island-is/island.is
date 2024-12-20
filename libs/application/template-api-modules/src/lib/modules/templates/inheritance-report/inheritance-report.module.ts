import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

import { InheritanceReportService } from './inheritance-report.service'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'

@Module({
  imports: [
    SharedTemplateAPIModule,
    SyslumennClientModule,
    NationalRegistryXRoadModule,
  ],
  providers: [InheritanceReportService],
  exports: [InheritanceReportService],
})
export class InheritanceReportModule {}
