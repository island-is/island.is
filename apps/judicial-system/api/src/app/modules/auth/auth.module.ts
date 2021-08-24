import { Module } from '@nestjs/common'

import { environment } from '../../../environments'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

const { audience: audienceUrl } = environment.auth

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'IslandisLogin',
      useFactory: () => new (require('@island.is/login'))({ audienceUrl }),
    },
  ],
})
export class AuthModule {}
