import { Module } from '@nestjs/common'
import { InnaClientService } from './inna.service'
import { InnaClientProvider } from './inna.provider'

@Module({
  providers: [InnaClientService, InnaClientProvider],
  exports: [InnaClientService],
})
export class InnaClientModule {}
