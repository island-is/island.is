import { Module } from '@nestjs/common'

import { CaseResolver } from './case.resolver'
import { LimitedAccessCaseResolver } from './limitedAccessCase.resolver'

@Module({
  providers: [CaseResolver, LimitedAccessCaseResolver],
})
export class CaseModule {}
