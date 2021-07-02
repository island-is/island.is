import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { ApplicationModel } from './models'
import { ApplicationEventModule } from '../applicationEvent'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'

@Module({
  imports: [
    ApplicationEventModule,
    SequelizeModule.forFeature([ApplicationModel]),
  ],
  providers: [ApplicationService],
  controllers: [ApplicationController],
  exports: [ApplicationService],
})
export class ApplicationModule {}
