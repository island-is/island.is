import { Module } from '@nestjs/common'

import { PersonalTaxReturnResolver } from './personalTaxReturn.resolver'
import { PersonalTaxReturnService } from './personalTaxReturn.service'
import { PersonalTaxReturnModule as PersonalTaxReturnClientModule } from '@island.is/clients/rsk/personal-tax-return'

@Module({
  imports: [PersonalTaxReturnClientModule],
  providers: [PersonalTaxReturnResolver, PersonalTaxReturnService],
})
export class PersonalTaxReturnModule {}
