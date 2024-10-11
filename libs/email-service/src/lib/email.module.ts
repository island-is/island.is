import { Module } from '@nestjs/common'

import { AdapterService } from '../tools/adapter.service'
import { EmailService } from './email.service'

@Module({
  providers: [EmailService, AdapterService],
  exports: [EmailService],
})
export class EmailModule {}
