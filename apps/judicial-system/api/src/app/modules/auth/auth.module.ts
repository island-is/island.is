import { Module } from '@nestjs/common'

import { BackendModule } from '../backend/backend.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [BackendModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
