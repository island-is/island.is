import { forwardRef,Global, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule } from '../auth/auth.module'

import { AccessControlModel } from './accessControl.model'
import { AccessControlResolver } from './accessControl.resolver'
import { AccessControlService } from './accessControl.service'

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([AccessControlModel]),
    forwardRef(() => AuthModule),
  ],
  providers: [AccessControlService, AccessControlResolver],
  exports: [AccessControlService],
})
export class AccessControlModule {}
