import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Victim } from '../repository'
import { CaseModule } from '..'
import { VictimController } from './victim.controller'
import { VictimService } from './victim.service'

@Module({
  imports: [forwardRef(() => CaseModule), SequelizeModule.forFeature([Victim])],
  controllers: [VictimController],
  providers: [VictimService],
  exports: [VictimService],
})
export class VictimModule {}
