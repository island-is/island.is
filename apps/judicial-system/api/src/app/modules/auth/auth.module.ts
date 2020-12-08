import { Module } from '@nestjs/common'

import { environment } from '../../../environments'
import { BackendAPI } from '../../../services'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

const { audience: audienceUrl } = environment.auth

@Module({
  controllers: [AuthController],
  providers: [
    BackendAPI,
    AuthService,
    {
      provide: 'IslandisLogin',
      useFactory: () => new (require('islandis-login'))({ audienceUrl }),
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
