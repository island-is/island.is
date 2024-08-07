import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { EmailModule } from '@island.is/email-service'

import { CourtClientModule } from '@island.is/judicial-system/court-client'

import { EventModule } from '../index'
import { RobotLog } from './models/robotLog.model'
import { CourtService } from './court.service'

@Module({
  imports: [
    SequelizeModule.forFeature([RobotLog]),
    CourtClientModule,
    EmailModule,
    forwardRef(() => EventModule),
  ],
  providers: [CourtService],
  exports: [CourtService],
})
export class CourtModule {}
