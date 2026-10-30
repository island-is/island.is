import { Module } from '@nestjs/common'

import { FeatureModule } from '../feature/feature.module'
import { CivilClaimantResolver } from './civilClaimant.resolver'
import { DefendantResolver } from './defendant.resolver'
import { LimitedAccessDefendantResolver } from './limitedAccessDefendant.resolver'

@Module({
  imports: [FeatureModule],
  providers: [
    DefendantResolver,
    CivilClaimantResolver,
    LimitedAccessDefendantResolver,
  ],
})
export class DefendantModule {}
