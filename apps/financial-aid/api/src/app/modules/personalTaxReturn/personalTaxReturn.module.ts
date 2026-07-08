import { Module } from '@nestjs/common'

import { PersonalTaxReturnResolver } from './personalTaxReturn.resolver'
import { BackendModule } from '../../../services'

@Module({
  imports: [BackendModule],
  providers: [PersonalTaxReturnResolver],
})
export class PersonalTaxReturnModule {}
