import { DynamicModule, Global, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { EXPIRES_IN_SECONDS } from '@island.is/judicial-system/consts'

import { JwtStrategy } from './jwt.strategy'
import { SharedAuthService } from './auth.service'

export interface SharedAuthModuleOptions {
  jwtSecret: string
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
          provide: 'JWT_SECRET',
          useFactory: () => options.jwtSecret,
        },
        JwtStrategy,
        SharedAuthService,
      ],
      exports: [SharedAuthService],
    }
  }
}
