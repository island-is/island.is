import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { CitizenshipService } from './citizenship.service'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import {
  DirectorateOfImmigrationClientModule,
  DirectorateOfImmigrationClientConfig,
} from '@island.is/clients/directorate-of-immigration'
import { ApplicationAttachmentService } from './attachments/applicationAttachment.service'
import { S3Service } from './attachments/s3.service'
import { S3 } from 'aws-sdk'
export class CitizenshipModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: CitizenshipModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        DirectorateOfImmigrationClientModule,
        NationalRegistryClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [DirectorateOfImmigrationClientConfig],
        }),
      ],
      providers: [
        CitizenshipService,
        ApplicationAttachmentService,
        S3Service,
        {
          provide: S3,
          useValue: new S3(),
        },
      ],
      exports: [CitizenshipService],
    }
  }
}
