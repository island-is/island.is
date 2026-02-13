import { Module } from '@nestjs/common'
import { HmsRentalAgreementService } from './hmsRentalAgreement.service'
import { exportedApis } from './apis'

@Module({
  providers: [...exportedApis, HmsRentalAgreementService],
  exports: [...exportedApis, HmsRentalAgreementService],
})
export class HmsRentalAgreementClientModule {}
