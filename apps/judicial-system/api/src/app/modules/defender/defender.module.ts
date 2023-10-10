import { Module } from '@nestjs/common'

import { DefenderController } from './defender.controller'
import { DefenderService } from './defender.service'

@Module({
  controllers: [DefenderController],
  providers: [DefenderService],
  exports: [DefenderService],
})
export class DefenderModule {}
