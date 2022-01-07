import { Global, Module, forwardRef } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule } from '../auth/auth.module'

import { AccessControlService } from './accessControl.service'
import { AccessControlModel } from './accessControl.model'
import { AccessControlResolver } from './accessControl.resolver'

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
