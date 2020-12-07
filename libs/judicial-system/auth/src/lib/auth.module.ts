import { Global, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { EXPIRES_IN_SECONDS } from '@island.is/judicial-system/consts'

import environment from './environment'
import { JwtStrategy } from './jwt.strategy'
import { SharedAuthService } from './auth.service'

@Global()
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
    }),
    JwtModule.register({
      secretOrPrivateKey: environment.jwtSecret,
      signOptions: {
        expiresIn: EXPIRES_IN_SECONDS,
      },
    }),
  ],
  providers: [JwtStrategy, SharedAuthService],
  exports: [SharedAuthService],
})
export class SharedAuthModule {}
