import { Module } from '@nestjs/common'
import { InnaClientModule } from '@island.is/clients/inna'
import { InnaService } from './inna.service'

@Module({
  imports: [InnaClientModule],
  providers: [InnaService],
  exports: [InnaService],
})
export class InnaModule {}
