import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { MessageModule } from '@island.is/judicial-system/message'

import { CourtModule } from '../court/court.module'
import { CaseModule } from '../case/case.module'
import { Defendant } from './models/defendant.model'
import { DefendantService } from './defendant.service'
import { DefendantController } from './defendant.controller'
import { InternalDefendantController } from './internalDefendant.controller'

@Module({
  imports: [
    MessageModule,
    forwardRef(() => CourtModule),
    forwardRef(() => CaseModule),
    SequelizeModule.forFeature([Defendant]),
  ],
  controllers: [DefendantController, InternalDefendantController],
  providers: [DefendantService],
  exports: [DefendantService],
})
export class DefendantModule {}
