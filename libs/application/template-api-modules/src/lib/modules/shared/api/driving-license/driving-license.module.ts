import { DynamicModule } from '@nestjs/common'

// Here you import your module service
import { DrivingLicenseProviderService } from './driving-license.service'
import { DrivingLicenseModule as DrivingLicenseApiModule } from '@island.is/api/domains/driving-license'

export class DrivingLicenseModule {
  static register(): DynamicModule {
    return {
      module: DrivingLicenseModule,
      imports: [DrivingLicenseApiModule],
      providers: [DrivingLicenseProviderService],
      exports: [DrivingLicenseProviderService],
    }
  }
}
