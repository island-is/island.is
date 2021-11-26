import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { environment } from '../../../environments'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'
import { AuthPublicApiClientModule, AuthPublicApiClientModuleConfig } from '@island.is/clients/auth-public-api'

const ONE_HOUR = 3600
const auth_config = {baseApiUrl: process.env.AUTH_PUBLIC_API_URL ?? 'http://localhost:4242',} as AuthPublicApiClientModuleConfig
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
    AuthPublicApiClientModule.register(
      auth_config
    )
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
