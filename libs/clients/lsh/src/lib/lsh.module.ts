import { Module } from '@nestjs/common'
import { LshClientService } from './lsh.service'
import { LshApiProvider, LshQuestionnaireApiProvider } from './lsh.provider'

@Module({
  providers: [LshClientService, LshApiProvider, LshQuestionnaireApiProvider],
  exports: [LshClientService],
})
export class LshClientModule {}
