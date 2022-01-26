import { Module } from '@nestjs/common'

import { PersonalTaxReturnResolver } from './personalTaxReturn.resolver'
import { PersonalTaxReturnService } from './personalTaxReturn.service'

@Module({
  providers: [PersonalTaxReturnResolver, PersonalTaxReturnService],
})
export class PersonalTaxReturnModule {}
