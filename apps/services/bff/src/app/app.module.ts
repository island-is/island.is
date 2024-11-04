import { ConfigModule } from '@island.is/nest/config'
import { Module } from '@nestjs/common'
import { BffConfig } from './bff.config'
import { AuthModule as AppAuthModule } from './modules/auth/auth.module'
import { CacheModule } from './modules/cache/cache.module'
import { ProxyModule } from './modules/proxy/proxy.module'
import { UserModule } from './modules/user/user.module'
import { EnhancedFetchModule } from './modules/enhancedFetch/enhanced-fetch.module'

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [BffConfig],
    }),
    UserModule,
    AppAuthModule,
    ProxyModule,
    EnhancedFetchModule,
  ],
})
export class AppModule {}
