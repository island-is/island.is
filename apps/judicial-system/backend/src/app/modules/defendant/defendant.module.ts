import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { MessageModule } from '@island.is/judicial-system/message'

import { CaseModule } from '../case/case.module'
import { CourtModule } from '../court/court.module'
import { CivilClaimant } from './models/civilClaimant.model'
import { Defendant } from './models/defendant.model'
import { DefendantEventLog } from './models/defendantEventLog.model'
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
    SequelizeModule.forFeature([Defendant, CivilClaimant, DefendantEventLog]),
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
