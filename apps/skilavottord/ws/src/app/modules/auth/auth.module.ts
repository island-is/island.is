import { Module, forwardRef } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { environment } from '../../../environments'
import { AccessControlModule } from '../accessControl'

import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'

const ONE_HOUR = 3600

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
    }),
    JwtModule.register({
      secretOrPrivateKey: environment.auth.jwtSecret,
      signOptions: {
        expiresIn: ONE_HOUR,
      },
    }),
    forwardRef(() => AccessControlModule),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy],
})
export class AuthModule {}
