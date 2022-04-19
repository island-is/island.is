import { DynamicModule, Module } from '@nestjs/common'
import { DrivingLicenseBookClientModule } from '@island.is/clients/driving-license-book'
import { DrivingLicenseBookResolver } from './drivingLicenseBook.resolver'
import { DrivingLicenseBookService } from './drivingLicenseBook.service'
import { DrivingLicenseModule } from '@island.is/api/domains/driving-license'
import { DrivingLicenseApiConfig } from '@island.is/clients/driving-license'

export interface Config {
  clientConfig: DrivingLicenseApiConfig
}
@Module({
  imports: [DrivingLicenseBookClientModule],
})
export class DrivingLicenseBookModule {
  static register(baseConfig: Config): DynamicModule {
    return {
      module: DrivingLicenseBookModule,
      imports: [DrivingLicenseModule.register(baseConfig)],
      providers: [DrivingLicenseBookResolver, DrivingLicenseBookService],
      exports: [DrivingLicenseBookService],
    }
  }
}
