import { Module } from '@nestjs/common'
import { LshClientModule } from '@island.is/clients/lsh'

@Module({
  imports: [LshClientModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class QuestionnariesModule {}
