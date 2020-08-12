import { Module } from '@nestjs/common'

import { AuthService } from './auth.service'
import { AuthRepository } from './auth.repository'
import { AuthResolver } from './auth.resolver'

@Module({
  providers: [AuthResolver, AuthService, AuthRepository],
})
export class AuthModule {}
