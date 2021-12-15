import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule } from '../auth'

import { AccessControlService } from './accessControl.service'
import { AccessControlModel } from './accessControl.model'
import { AccessControlResolver } from './accessControl.resolver'

@Module({
  imports: [SequelizeModule.forFeature([AccessControlModel]), AuthModule],
  providers: [AccessControlService, AccessControlResolver],
  exports: [AccessControlService],
})
export class AccessControlModule {}
