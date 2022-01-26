import { Module } from '@nestjs/common'
import { PersonalTaxReturnApi } from './personalTaxReturnApi.service'

@Module({
  providers: [PersonalTaxReturnApi],
  exports: [PersonalTaxReturnApi],
})
export class PersonalTaxReturnModule {}
