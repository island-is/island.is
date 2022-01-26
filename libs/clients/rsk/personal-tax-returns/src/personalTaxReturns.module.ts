import { Module } from '@nestjs/common'
import { PersonalTaxReturnsService } from './personalTaxReturns.service'

@Module({
  providers: [PersonalTaxReturnsService],
  exports: [PersonalTaxReturnsService],
})
export class PersonalTaxReturnsModule {}
