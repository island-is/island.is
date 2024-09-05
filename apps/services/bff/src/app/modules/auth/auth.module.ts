import { Module } from '@nestjs/common'
import { IdsService } from '../ids/ids.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PKCEService } from './pkce.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, PKCEService, IdsService],
  exports: [AuthService],
})
export class AuthModule {}
