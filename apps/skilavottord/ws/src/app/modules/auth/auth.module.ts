import { Module, forwardRef } from '@nestjs/common'

import { AuthModule as IslandIsAuthModule } from '@island.is/auth-nest-tools'

import { AccessControlModule } from '../accessControl/accessControl.module'

import { AuthGuard } from './auth.guard'
import { RolesGuard } from './roles.guard'
import { UserResolver } from './user.resolver'

import { environment } from '../../../environments'

@Module({
  imports: [
    forwardRef(() => AccessControlModule),
    IslandIsAuthModule.register(environment.auth),
  ],
  providers: [UserResolver, AuthGuard, RolesGuard],
})
export class AuthModule {}
