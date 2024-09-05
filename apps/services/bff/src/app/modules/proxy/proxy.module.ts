import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { IdsService } from '../ids/ids.service'
import { ProxyController } from './proxy.controller'
import { ProxyService } from './proxy.service'

@Module({
  imports: [AuthModule],
  controllers: [ProxyController],
  providers: [ProxyService, IdsService],
})
export class ProxyModule {}
