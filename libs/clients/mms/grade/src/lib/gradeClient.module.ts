import { Module } from '@nestjs/common'
import { GradeClientProvider } from './gradeClient.provider'
import { GradeClientService } from './gradeClient.service'

@Module({
  providers: [GradeClientProvider, GradeClientService],
  exports: [GradeClientService],
})
export class GradesClientModule {}
