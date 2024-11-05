import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { SocialInsuranceAdministrationService } from './social-insurance-administration.service'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { SocialInsuranceAdministrationClientModule } from '@island.is/clients/social-insurance-administration'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [
    SocialInsuranceAdministrationClientModule,
    SharedTemplateAPIModule,
    ApplicationApiCoreModule,
    NationalRegistryClientModule,
    AwsModule,
  ],
  providers: [SocialInsuranceAdministrationService],
  exports: [SocialInsuranceAdministrationService],
})
export class SocialInsuranceAdministrationModule {}
