import { Module } from '@nestjs/common'

import { MessageService } from './message.service'

@Module({
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
