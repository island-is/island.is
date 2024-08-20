import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { ConfigType } from '@island.is/nest/config'

import { EXPIRES_IN_SECONDS } from '@island.is/judicial-system/consts'

import { sharedAuthModuleConfig } from './auth.config'
import { SharedAuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'

@Global()
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
    }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigType<typeof sharedAuthModuleConfig>) => ({
        secret: config.jwtSecret,
        signOptions: {
          expiresIn: EXPIRES_IN_SECONDS,
        },
      }),
      inject: [sharedAuthModuleConfig.KEY],
    }),
  ],
  providers: [JwtStrategy, SharedAuthService],
  exports: [SharedAuthService],
})
export class SharedAuthModule {}
