import { DynamicModule, Module } from '@nestjs/common'
import { JwtStrategy } from './jwt.strategy'
import type { AuthConfig } from './types'

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
      ],
      exports: [JwtStrategy],
    }
  }
}
