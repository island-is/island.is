import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { SocialInsuranceAdministrationService } from './social-insurance-administration.service'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { NationalRegistryV3ApplicationsClientModule } from '@island.is/clients/national-registry-v3-applications'
import { SocialInsuranceAdministrationClientModule } from '@island.is/clients/social-insurance-administration'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [
    SocialInsuranceAdministrationClientModule,
    SharedTemplateAPIModule,
    ApplicationApiCoreModule,
    NationalRegistryV3ApplicationsClientModule,
    AwsModule,
  ],
  providers: [SocialInsuranceAdministrationService],
  exports: [SocialInsuranceAdministrationService],
})
export class SocialInsuranceAdministrationModule {}
