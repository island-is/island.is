import { Module } from '@nestjs/common'

import { CaseResolver } from './case.resolver'
import { RestrictedCaseResolver } from './restrictedCase.resolver'

@Module({
  providers: [CaseResolver, RestrictedCaseResolver],
})
export class CaseModule {}
