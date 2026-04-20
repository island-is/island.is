import { Module } from '@nestjs/common'
import { exportedApis } from './apis'
import { HmsRentalAgreementService } from './hmsRentalAgreement.service'

@Module({
  providers: [...exportedApis, HmsRentalAgreementService],
  exports: [...exportedApis, HmsRentalAgreementService],
})
export class HmsRentalAgreementClientModule {}
