import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { SeminarsTemplateService } from './seminars.service'
import {
  SeminarsClientConfig,
  SeminarsClientModule,
} from '@island.is/clients/seminars-ver'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    SharedTemplateAPIModule,
    SeminarsClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [SeminarsClientConfig],
    }),
  ],
  providers: [SeminarsTemplateService],
  exports: [SeminarsTemplateService],
})
export class SeminarsTemplateModule {}
