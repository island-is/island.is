import { Module } from '@nestjs/common'

import { environment } from '../../../environments'
import { AuditModule } from '../audit'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

const { audience: audienceUrl } = environment.auth

@Module({
  imports: [AuditModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'IslandisLogin',
      useFactory: () => new (require('islandis-login'))({ audienceUrl }),
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
