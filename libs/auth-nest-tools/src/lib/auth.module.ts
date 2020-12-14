import { DynamicModule, Module } from '@nestjs/common'
import { JwtStrategy } from './jwt.strategy'

export interface Config {
  audience: string
  issuer: string
  jwksUri: string
}

@Module({})
export class AuthModule {
  static register(options: Config): DynamicModule {
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
