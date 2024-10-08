import { ZendeskService } from './zendesk.service'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ZendeskServiceConfigurations } from './zendesk.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ZendeskServiceConfigurations],
    }),
  ],
  providers: [ZendeskService],
  exports: [ZendeskService],
})
export class ZendeskModule {}
