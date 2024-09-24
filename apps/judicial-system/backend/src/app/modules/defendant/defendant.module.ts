import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { MessageModule } from '@island.is/judicial-system/message'

import { CaseModule } from '../case/case.module'
import { CourtModule } from '../court/court.module'
import { Subpoena } from '../subpoena/models/subpoena.model'
import { CivilClaimant } from './models/civilClaimant.model'
import { Defendant } from './models/defendant.model'
import { CivilClaimantController } from './civilClaimant.controller'
import { CivilClaimantService } from './civilClaimant.service'
import { DefendantController } from './defendant.controller'
import { DefendantService } from './defendant.service'
import { InternalDefendantController } from './internalDefendant.controller'

@Module({
  imports: [
    MessageModule,
    forwardRef(() => CourtModule),
    forwardRef(() => CaseModule),
    SequelizeModule.forFeature([Defendant, CivilClaimant, Subpoena]),
  ],
  controllers: [
    DefendantController,
    InternalDefendantController,
    CivilClaimantController,
  ],
  providers: [DefendantService, CivilClaimantService],
  exports: [DefendantService],
})
export class DefendantModule {}
