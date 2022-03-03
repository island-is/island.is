import { forwardRef,Module } from '@nestjs/common'

import { AuthModule as IslandIsAuthModule } from '@island.is/auth-nest-tools'

import { environment } from '../../../environments'
import { AccessControlModule } from '../accessControl/accessControl.module'

import { AuthGuard } from './auth.guard'
import { RolesGuard } from './roles.guard'
import { UserResolver } from './user.resolver'

@Module({
  imports: [
    forwardRef(() => AccessControlModule),
    IslandIsAuthModule.register(environment.auth),
  ],
  providers: [UserResolver, AuthGuard, RolesGuard],
})
export class AuthModule {}
