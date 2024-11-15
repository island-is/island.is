import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { SeminarsTemplateService } from './seminars'

@Module({
  imports: [
    SharedTemplateAPIModule,
    // WorkAccidentClientModule,
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   load: [WorkAccidentClientConfig],
    // }),
  ],
  providers: [SeminarsTemplateService],
  exports: [SeminarsTemplateService],
})
export class SeminarsTemplateModule {}
