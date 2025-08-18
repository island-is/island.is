import { Module } from '@nestjs/common'

import { BackendModule } from '../backend/backend.module'
import { DefenderController } from './defender.controller'
import { DefenderService } from './defender.service'

@Module({
  imports: [BackendModule],
  controllers: [DefenderController],
  providers: [DefenderService],
  exports: [DefenderService],
})
export class DefenderModule {}
