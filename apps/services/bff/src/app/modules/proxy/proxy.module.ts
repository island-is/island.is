import { Module } from '@nestjs/common'
import { CryptoService } from '../../services/crypto.service'
import { CryptoKeyService } from '../../services/cryptoKey.service'
import { ErrorService } from '../../services/error.service'
import { SessionCookieService } from '../../services/sessionCookie.service'
import { AuthModule } from '../auth/auth.module'
import { TokenRefreshService } from '../auth/token-refresh.service'
import { IdsService } from '../ids/ids.service'
import { ProxyController } from './proxy.controller'
import { ProxyService } from './proxy.service'

@Module({
  imports: [AuthModule],
  controllers: [ProxyController],
  providers: [
    ProxyService,
    CryptoService,
    TokenRefreshService,
    ErrorService,
    IdsService,
    SessionCookieService,
    CryptoKeyService,
  ],
})
export class ProxyModule {}
