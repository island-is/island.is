import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ApplicationEventModel } from './models'
import { ApplicationEventService } from './applicationEvent.service'

@Module({
  imports: [SequelizeModule.forFeature([ApplicationEventModel])],
  providers: [ApplicationEventService],
  exports: [ApplicationEventService],
})
export class ApplicationEventModule {}
