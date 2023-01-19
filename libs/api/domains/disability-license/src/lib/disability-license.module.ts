import { Module } from '@nestjs/common'
import {
  DisabilityLicenseApiProvider,
  DisabilityLicenseClientModule,
} from '@island.is/clients/disability-license'
import { DisabilityLicenseResolver } from './disability-license.resolver'

@Module({
  providers: [DisabilityLicenseResolver, DisabilityLicenseApiProvider],
  imports: [DisabilityLicenseClientModule],
})
export class DisabilityLicenseModule {}
