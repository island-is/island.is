import { Module } from '@nestjs/common'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { DefenderModule } from '../defender/defender.module'

@Module({
  imports: [DefenderModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
