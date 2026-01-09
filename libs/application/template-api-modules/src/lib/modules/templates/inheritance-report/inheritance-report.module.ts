import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

import { InheritanceReportService } from './inheritance-report.service'
import { NationalRegistryV3Module } from '../../shared/api/national-registry-v3/national-registry-v3.module'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [
    SharedTemplateAPIModule,
    SyslumennClientModule,
    NationalRegistryV3Module,
    AwsModule,
  ],
  providers: [InheritanceReportService],
  exports: [InheritanceReportService],
})
export class InheritanceReportModule {}
