import { DynamicModule } from '@nestjs/common'
import { DrivingSchoolConfirmationService } from './driving-school-confirmation.service'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { DrivingLicenseBookModule } from '@island.is/api/domains/driving-license-book'

export class DrivingSchoolConfirmationModule {
  static register(): DynamicModule {
    return {
      module: DrivingSchoolConfirmationModule,
      imports: [DrivingLicenseBookModule],
      providers: [DrivingSchoolConfirmationService],
      exports: [DrivingSchoolConfirmationService],
    }
  }
}
