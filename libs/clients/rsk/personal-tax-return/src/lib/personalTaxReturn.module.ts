import { HttpModule, Module } from '@nestjs/common'
import { PersonalTaxReturnApi } from './personalTaxReturnApi.service'

@Module({
  imports: [HttpModule],
  providers: [PersonalTaxReturnApi],
  exports: [PersonalTaxReturnApi],
})
export class PersonalTaxReturnModule {}
