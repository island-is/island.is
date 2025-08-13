import { Module } from '@nestjs/common'
import { VmstUnemploymentClientService } from './vmstUnemploymentClient.service'

@Module({
  providers: [VmstUnemploymentClientService],
  exports: [VmstUnemploymentClientService],
})
export class VmstUnemploymentClientModule {}
