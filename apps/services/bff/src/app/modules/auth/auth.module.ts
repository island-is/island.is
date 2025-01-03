import { Module } from '@nestjs/common'
import { CryptoService } from '../../services/crypto.service'
import { CryptoKeyService } from '../../services/cryptoKey.service'
import { PKCEService } from '../../services/pkce.service'
import { SessionCookieService } from '../../services/sessionCookie.service'
import { IdsService } from '../ids/ids.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PKCEService,
    IdsService,
    CryptoService,
    SessionCookieService,
    CryptoKeyService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
