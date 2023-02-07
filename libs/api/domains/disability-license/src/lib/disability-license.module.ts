import { Module } from '@nestjs/common'
import { DisabilityLicenseClientModule } from '@island.is/clients/disability-license'
import { DisabilityLicenseResolver } from './disability-license.resolver'

@Module({
  providers: [DisabilityLicenseResolver],
  imports: [DisabilityLicenseClientModule],
})
export class DisabilityLicenseModule {}
