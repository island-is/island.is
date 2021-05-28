import { DynamicModule, Global } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { JwtStrategy } from './jwt.strategy'
import { SharedAuthService } from './auth.service'
import { COOKIE_EXPIRES_IN_SECONDS } from './const'

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
            expiresIn: COOKIE_EXPIRES_IN_SECONDS,
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
