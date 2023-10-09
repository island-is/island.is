import { DynamicModule, Global } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { EXPIRES_IN_SECONDS } from '@island.is/judicial-system/consts'

import { SharedAuthService } from './auth.service'
import { SECRET_TOKEN } from './guards'
import { JwtStrategy } from './jwt.strategy'

export interface SharedAuthModuleOptions {
  jwtSecret: string
  secretToken: string
}

@Global()
export class SharedAuthModule {
  static register(options: SharedAuthModuleOptions): DynamicModule {
    return {
      module: SharedAuthModule,
      imports: [
        PassportModule.register({
          defaultStrategy: 'jwt',
          session: true,
        }),
        JwtModule.register({
          secretOrPrivateKey: options.jwtSecret,
          signOptions: {
            expiresIn: EXPIRES_IN_SECONDS,
          },
        }),
      ],
      providers: [
        {
          provide: SECRET_TOKEN,
          useFactory: () => options.secretToken,
        },
        {
          provide: 'JWT_SECRET',
          useFactory: () => options.jwtSecret,
        },
        JwtStrategy,
        SharedAuthService,
      ],
      exports: [SECRET_TOKEN, SharedAuthService],
    }
  }
}
