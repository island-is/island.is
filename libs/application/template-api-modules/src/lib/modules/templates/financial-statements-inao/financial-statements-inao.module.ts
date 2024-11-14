import {
  FinancialStatementsInaoClientConfig,
  FinancialStatementsInaoClientModule,
} from '@island.is/clients/financial-statements-inao'

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../shared'
import { FinancialStatementsInaoTemplateService } from './financial-statements-inao.service'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ConfigModule.forRoot({
      load: [FinancialStatementsInaoClientConfig],
    }),
    FinancialStatementsInaoClientModule,
    AwsModule,
  ],
  providers: [FinancialStatementsInaoTemplateService],
  exports: [FinancialStatementsInaoTemplateService],
})
export class FinancialStatementsInaoTemplateModule {}
