import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { DrivingLicenseBookUpdateInstructorService } from './driving-license-book-update-instructor.service'
import { DrivingLicenseBookModule } from '@island.is/api/domains/driving-license-book'

export class DrivingLicenseBookUpdateInstructorModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: DrivingLicenseBookUpdateInstructorModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        DrivingLicenseBookModule,
      ],
      providers: [DrivingLicenseBookUpdateInstructorService],
      exports: [DrivingLicenseBookUpdateInstructorService],
    }
  }
}
