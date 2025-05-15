import { Module } from '@nestjs/common'

import { BackendModule } from '../backend/backend.module'
import { DefenderModule } from '../defender'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [DefenderModule, BackendModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
