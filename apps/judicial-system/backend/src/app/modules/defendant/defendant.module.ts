import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CaseModule } from '../index'

import { Defendant } from './models/defendant.model'
import { DefendantController } from './defendant.controller'
import { DefendantService } from './defendant.service'

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
