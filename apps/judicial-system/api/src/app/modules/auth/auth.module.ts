import { Module } from '@nestjs/common'

import { LawyersModule } from '@island.is/judicial-system/lawyers'

import { BackendModule } from '../backend/backend.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [BackendModule, LawyersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
