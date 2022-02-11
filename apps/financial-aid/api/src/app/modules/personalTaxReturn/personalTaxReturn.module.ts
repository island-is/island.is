import { Module } from '@nestjs/common'

import { PersonalTaxReturnResolver } from './personalTaxReturn.resolver'

@Module({
  providers: [PersonalTaxReturnResolver],
})
export class PersonalTaxReturnModule {}
