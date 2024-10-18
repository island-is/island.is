import { Module } from '@nestjs/common'

import { CivilClaimantResolver } from './civilClaimant.resolver'
import { DefendantResolver } from './defendant.resolver'

@Module({
  providers: [DefendantResolver, CivilClaimantResolver],
})
export class DefendantModule {}
