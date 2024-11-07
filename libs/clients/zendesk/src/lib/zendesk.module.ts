import { ZendeskService } from './zendesk.service'
import { Module } from '@nestjs/common'

@Module({
  providers: [ZendeskService],
  exports: [ZendeskService],
})
export class ZendeskModule {}
