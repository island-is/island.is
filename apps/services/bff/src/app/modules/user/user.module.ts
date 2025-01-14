import { Module } from '@nestjs/common'
import { CryptoService } from '../../services/crypto.service'
import { CryptoKeyService } from '../../services/cryptoKey.service'
import { ErrorService } from '../../services/error.service'
import { SessionCookieService } from '../../services/sessionCookie.service'
import { AuthModule } from '../auth/auth.module'
import { TokenRefreshService } from '../auth/token-refresh.service'
import { IdsService } from '../ids/ids.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [
    UserService,
    IdsService,
    CryptoService,
    TokenRefreshService,
    ErrorService,
    SessionCookieService,
    CryptoKeyService,
  ],
})
export class UserModule {}
