import { DynamicModule } from '@nestjs/common'
import { DisabilityLicenseApiService } from './disability-license.service'
import { DisabilityLicenseClientModule } from '@island.is/clients/disability-license'
export class DisabilityLicenseModule {
  static register(): DynamicModule {
    return {
      module: DisabilityLicenseModule,
      imports: [DisabilityLicenseClientModule],
      providers: [DisabilityLicenseApiService],
      exports: [DisabilityLicenseApiService],
    }
  }
}
