import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CivilClaimant } from '../repository'
import { CaseModule, CourtModule, RepositoryModule } from '..'
import { CivilClaimantController } from './civilClaimant.controller'
import { CivilClaimantService } from './civilClaimant.service'
import { DefendantController } from './defendant.controller'
import { DefendantService } from './defendant.service'
import { InternalDefendantController } from './internalDefendant.controller'
import { LimitedAccessDefendantController } from './limitedAccessDefendant.controller'

@Module({
  imports: [
    forwardRef(() => CourtModule),
    forwardRef(() => CaseModule),
    forwardRef(() => RepositoryModule),
    SequelizeModule.forFeature([CivilClaimant]),
  ],
  controllers: [
    DefendantController,
    InternalDefendantController,
    CivilClaimantController,
    LimitedAccessDefendantController,
  ],
  providers: [DefendantService, CivilClaimantService],
  exports: [DefendantService, CivilClaimantService],
})
export class DefendantModule {}
