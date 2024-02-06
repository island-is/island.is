import { Module } from '@nestjs/common'

import { DefenderModule } from '../defender'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [DefenderModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
