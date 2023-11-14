import { Module } from '@nestjs/common'
import { StatisticsClientService } from './statistics.service'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { StatisticsClientConfig } from './statistics.config'

const CACHE_TTL = 15 * 60 * 1000 // 15 minutes

@Module({
  imports: [
    CacheModule.register({
      ttl: CACHE_TTL,
    }),
    ConfigModule.forRoot({
      load: [StatisticsClientConfig],
    }),
  ],
  providers: [StatisticsClientService],
  exports: [StatisticsClientService],
})
export class StatisticsClientModule {}
