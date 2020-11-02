import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { environment } from '../../../environments'
import { BackendAPI } from '../../../services'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'

const { audience: audienceUrl } = environment.auth

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
  ],
  controllers: [AuthController],
  providers: [
    BackendAPI,
    AuthService,
    JwtStrategy,
    {
      provide: 'IslandisLogin',
      useFactory: () => new (require('islandis-login'))({ audienceUrl }),
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
