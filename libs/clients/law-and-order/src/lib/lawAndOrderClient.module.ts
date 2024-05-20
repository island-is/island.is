import { Module } from '@nestjs/common'
import { LawAndOrderClientService } from './lawAndOrderClient.service'
import { LawAndOrderApiProvider } from './lawAndOrderClientApiConfig'

@Module({
  providers: [LawAndOrderApiProvider, LawAndOrderClientService],
  exports: [LawAndOrderClientService],
})
export class LawAndOrderClientModule {}
