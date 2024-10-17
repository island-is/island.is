import { Module } from '@nestjs/common'
import { IdsService } from '../ids/ids.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PKCEService } from '../../services/pkce.service'
import { CryptoService } from '../../services/crypto.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, PKCEService, IdsService, CryptoService],
  exports: [AuthService],
})
export class AuthModule {}
