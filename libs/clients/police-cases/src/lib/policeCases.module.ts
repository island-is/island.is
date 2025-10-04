import { Module } from '@nestjs/common'
import { PoliceCasesApiProvider } from './policeCases.provider'
import { PoliceCasesClientService } from './policeCases.service'

@Module({
  providers: [PoliceCasesApiProvider, PoliceCasesClientService],
  exports: [PoliceCasesClientService],
})
export class PoliceCasesClientModule {}
