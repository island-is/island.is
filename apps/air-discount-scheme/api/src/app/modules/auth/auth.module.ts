import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { environment } from '../../../environments'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'

import { AuthModule as AuthNestModule } from '@island.is/auth-nest-tools'

const ONE_HOUR = 3600
@Module({
  imports: [
    // PassportModule.register({
    //   defaultStrategy: 'jwt',
    //   session: true,
    // }),
    // JwtModule.register({
    //   secretOrPrivateKey: environment.auth.jwtSecret,
    //   signOptions: {
    //     expiresIn: ONE_HOUR,
    //   },
    // }),
    AuthNestModule.register(environment.identityServerAuth),
  ],
  controllers: [AuthController],
  providers: [AuthService],// JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
