import { Module } from '@nestjs/common'

import { environment } from '../../../environments'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'IslandisLoginOsk',
      useFactory: () =>
        new (require('@island.is/login'))({
          audienceUrl: environment.auth.audienceOsk,
        }),
    },
    {
      provide: 'IslandisLoginVeita',
      useFactory: () =>
        new (require('@island.is/login'))({
          audienceUrl: environment.auth.audienceVeita,
        }),
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
