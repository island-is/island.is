import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

import { EstateTemplateService } from './estate.service'
import { AwsModule } from '@island.is/nest/aws'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [
    SharedTemplateAPIModule,
    SyslumennClientModule,
    AwsModule,
    FeatureFlagModule,
  ],
  providers: [EstateTemplateService],
  exports: [EstateTemplateService],
})
export class EstateTemplateModule {}
