import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

import { InheritanceReportService } from './inheritance-report.service'
import { NationalRegistryV3Module } from '../../shared/api/national-registry-v3/national-registry-v3.module'
import { AwsModule } from '@island.is/nest/aws'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [
    SharedTemplateAPIModule,
    SyslumennClientModule,
    NationalRegistryV3Module,
    AwsModule,
    FeatureFlagModule,
  ],
  providers: [InheritanceReportService],
  exports: [InheritanceReportService],
})
export class InheritanceReportModule {}
