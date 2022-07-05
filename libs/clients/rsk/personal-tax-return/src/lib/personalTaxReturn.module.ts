import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { PersonalTaxReturnApi } from './personalTaxReturnApi.service'

@Module({
  imports: [HttpModule],
  providers: [PersonalTaxReturnApi],
  exports: [PersonalTaxReturnApi],
})
export class PersonalTaxReturnModule {}
