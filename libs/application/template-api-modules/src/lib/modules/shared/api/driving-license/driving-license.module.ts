import { DynamicModule } from '@nestjs/common'

// Here you import your module service
import { DrivingLicenseProviderService } from './driving-license.service'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import { DrivingLicenseBookModule } from '@island.is/api/domains/driving-license-book'
import { DrivingLicenseBookClientModule } from '@island.is/clients/driving-license-book'

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
