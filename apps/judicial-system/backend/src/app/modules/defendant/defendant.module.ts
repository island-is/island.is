import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { MessageModule } from '@island.is/judicial-system/message'

import { CaseModule } from '../case/case.module'
import { ExplanatoryComment } from '../case/models/explanatoryComment.model'
import { CourtModule } from '../court/court.module'
import { Defendant } from './models/defendant.model'
import { DefendantController } from './defendant.controller'
import { DefendantService } from './defendant.service'
import { InternalDefendantController } from './internalDefendant.controller'

@Module({
  imports: [
    MessageModule,
    forwardRef(() => CourtModule),
    forwardRef(() => CaseModule),
    SequelizeModule.forFeature([Defendant, ExplanatoryComment]),
  ],
  controllers: [DefendantController, InternalDefendantController],
  providers: [DefendantService],
  exports: [DefendantService],
})
export class DefendantModule {}
