import { DynamicModule } from '@nestjs/common'

// Here you import your module service
import { DrivingLicenseProviderService } from './driving-license.service'
import { DrivingLicenseModule as DrivingLicenseApiModule } from '@island.is/api/domains/driving-license'
import { DrivingLicenseBookModule } from '@island.is/api/domains/driving-license-book'

export class DrivingLicenseModule {
  static register(): DynamicModule {
    return {
      module: DrivingLicenseModule,
      imports: [DrivingLicenseApiModule, DrivingLicenseBookModule],
      providers: [DrivingLicenseProviderService],
      exports: [DrivingLicenseProviderService],
    }
  }
}
