import { Module } from '@nestjs/common'
import { CacheModule } from '../cache/cache.module'
import { CacheService } from '../cache/cache.service'
import { ProxyController } from './proxy.controller'
import { ProxyService } from './proxy.service'
import { IdsService } from '../ids/ids.service'

@Module({
  imports: [CacheModule],
  controllers: [ProxyController],
  providers: [ProxyService, CacheService, IdsService],
})
export class ProxyModule {}
