import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CaseModule } from '../case/case.module'
import { Defendant } from './models/defendant.model'
import { DefendantService } from './defendant.service'
import { DefendantController } from './defendant.controller'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    SequelizeModule.forFeature([Defendant]),
  ],
  controllers: [DefendantController],
  providers: [DefendantService],
  exports: [DefendantService],
})
export class DefendantModule {}
