import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { PracticalExamTemplateService } from './practical-exam.service'
import { ConfigModule } from '@nestjs/config'
import {
  PracticalExamsClientModule,
  PracticalExamsClientConfig,
} from '@island.is/clients/practical-exams-ver'
@Module({
  imports: [
    SharedTemplateAPIModule,
    PracticalExamsClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [PracticalExamsClientConfig],
    }),
  ],
  providers: [PracticalExamTemplateService],
  exports: [PracticalExamTemplateService],
})
export class PracticalExamTemplateModule {}
