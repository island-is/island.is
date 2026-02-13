import { Module } from '@nestjs/common'
import { HmsRentalAgreementService } from './hmsRentalAgreement.service'
import { exportedApis } from './apis'

@Module({
  providers: [...exportedApis, HmsRentalAgreementService],
  exports: [HmsRentalAgreementService],
})
export class HmsRentalAgreementClientModule {}
