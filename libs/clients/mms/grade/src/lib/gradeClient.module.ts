import { Module } from '@nestjs/common'
import { GradeClientProvider } from './gradeClient.provider'

@Module({
  providers: [GradeClientProvider],
  exports: [],
})
export class MMSGradesClientModule {}
