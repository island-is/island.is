import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'

import {
  APPLICATION_ATTACHMENT_BUCKET,
  SocialInsuranceAdministrationService,
} from './social-insurance-administration.service'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { SocialInsuranceAdministrationClientModule } from '@island.is/clients/social-insurance-administration'
import { AwsService } from '@island.is/nest/aws'

export class SocialInsuranceAdministrationModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: SocialInsuranceAdministrationModule,
      imports: [
        SocialInsuranceAdministrationClientModule,
        SharedTemplateAPIModule.register(config),
        ApplicationApiCoreModule,
        NationalRegistryClientModule,
      ],
      providers: [
        AwsService,
        SocialInsuranceAdministrationService,
        {
          provide: APPLICATION_ATTACHMENT_BUCKET,
          useFactory: () => config.attachmentBucket,
        },
      ],
      exports: [SocialInsuranceAdministrationService],
    }
  }
}
