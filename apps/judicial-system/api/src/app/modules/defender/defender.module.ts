import { Module } from '@nestjs/common'

import { LawyersService } from '@island.is/judicial-system/lawyers'

import { DefenderController } from './defender.controller'
import { DefenderService } from './defender.service'

@Module({
  controllers: [DefenderController],
  providers: [DefenderService, LawyersService],
  exports: [DefenderService],
})
export class DefenderModule {}
