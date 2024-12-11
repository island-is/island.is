import { Module } from '@nestjs/common'

import { CivilClaimantResolver } from './civilClaimant.resolver'
import { DefendantResolver } from './defendant.resolver'
import { LimitedAccessDefendantResolver } from './limitedAccessDefendant.resolver'

@Module({
  providers: [
    DefendantResolver,
    CivilClaimantResolver,
    LimitedAccessDefendantResolver,
  ],
})
export class DefendantModule {}
