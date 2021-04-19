import { DynamicModule, Module } from '@nestjs/common'
import { JwtFromBodyStrategy } from './jwt-from-body.stragety'
import { JwtStrategy } from './jwt.strategy'

export interface AuthConfig {
  audience: string
  issuer: string
  jwksUri: string
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
          provide: JwtFromBodyStrategy,
          useValue: new JwtFromBodyStrategy(options),
        },
      ],
      exports: [JwtStrategy, JwtFromBodyStrategy],
    }
  }
}
