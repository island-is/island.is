import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule } from '../auth'
// TODO: import { AccessControlModel } from './accessControl.model'
import { AccessControlService } from './accessControl.service'
import { AccessControlResolver } from './accessControl.resolver'

@Module({
  imports: [
    // TODO: SequelizeModule.forFeature([AccessControlModel]),
    AuthModule,
  ],
  providers: [AccessControlResolver, AccessControlService],
})
export class AccessControlModule {}
