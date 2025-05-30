import { Module } from '@nestjs/common'
import { exportedApis } from './apis'

@Module({
  providers: exportedApis,
  exports: exportedApis,
})
export class HmsRentalAgreementClientModule {}
