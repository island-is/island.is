import { DynamicModule, Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';

@Module({})
export class AuthModule {
  static register(): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: JwtStrategy,
          useValue: new JwtStrategy(),
        },
      ],
      exports: [JwtStrategy],
    };
  }
}
