import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { MessageModule } from '@island.is/judicial-system/message'

import { CivilClaimant } from '../repository'
import {
  CaseModule,
  CourtModule,
  RepositoryModule,
  SubpoenaModule,
  VerdictModule,
} from '..'
import { CivilClaimantController } from './civilClaimant.controller'
import { CivilClaimantService } from './civilClaimant.service'
import { DefendantController } from './defendant.controller'
import { DefendantService } from './defendant.service'
import { InternalDefendantController } from './internalDefendant.controller'
import { LimitedAccessDefendantController } from './limitedAccessDefendant.controller'

@Module({
  imports: [
    MessageModule,
    forwardRef(() => CourtModule),
    forwardRef(() => CaseModule),
    forwardRef(() => SubpoenaModule),
    forwardRef(() => VerdictModule),
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
