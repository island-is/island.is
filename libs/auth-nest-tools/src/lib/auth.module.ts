import { DynamicModule, Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { AuthInterceptor } from './auth.interceptor'
import { JwtStrategy } from './jwt.strategy'

export interface AuthConfig {
  audience: string | string[]
  issuer: string | string[]
  allowClientNationalId?: boolean
}

@Module({})
export class AuthModule {
  static register(options: AuthConfig): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: JwtStrategy,
          useValue: new JwtStrategy(options),
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: AuthInterceptor,
        },
      ],
      exports: [JwtStrategy],
    }
  }
}
