import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { PracticalExamTemplateService } from './practical-exam.service'
import {
  WorkAccidentClientConfig,
  WorkAccidentClientModule,
} from '@island.is/clients/work-accident-ver'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    SharedTemplateAPIModule,
    WorkAccidentClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [WorkAccidentClientConfig], // TODO(balli) Replace with actual client when VER provides it
    }),
  ],
  providers: [PracticalExamTemplateService],
  exports: [PracticalExamTemplateService],
})
export class PracticalExamTemplateModule {}
