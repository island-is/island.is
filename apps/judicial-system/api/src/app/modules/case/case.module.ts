import { Module } from '@nestjs/common'

import { CaseResolver } from './case.resolver'
import { CaseLifetimeResolver } from './caseLifetime.resolver'
import { LimitedAccessCaseResolver } from './limitedAccessCase.resolver'

@Module({
  providers: [CaseResolver, CaseLifetimeResolver, LimitedAccessCaseResolver],
})
export class CaseModule {}
