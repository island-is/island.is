import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

// TODO: import { AccessControlModel } from './accessControl.model'
import { AccessControlService } from './accessControl.service'
import { AccessControlResolver } from './accessControl.resolver'

@Module({
  imports: [
    // TODO: SequelizeModule.forFeature([AccessControlModel]),
  ],
  providers: [AccessControlResolver, AccessControlService],
})
export class AccessControlModule {}
