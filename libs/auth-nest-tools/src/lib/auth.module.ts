import { DynamicModule, Module } from '@nestjs/common'
import { JwtStrategy } from './jwt.strategy'

export interface AuthConfig {
  audience?: string | string[]
  issuer: string | string[]
  allowClientNationalId?: boolean
  /**
   * Refuse DPoP-bound tokens (cnf.jkt) sent without a DPoP proof. For services
   * the app calls directly; services behind them get the token forwarded as
   * Bearer and leave this off.
   */
  requireDpopForBoundTokens?: boolean
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
      ],
      exports: [JwtStrategy],
    }
  }
}
