import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ApplicationEventModel } from './models'
import { ApplicationEventController } from './applicationEvent.controller'
import { ApplicationEventService } from './applicationEvent.service'
import { environment } from '../../../environments'

@Module({
  imports: [SequelizeModule.forFeature([ApplicationEventModel])],
  providers: [ApplicationEventService],
  controllers: [ApplicationEventController],
  exports: [ApplicationEventService],
})
export class ApplicationEventModule {}
