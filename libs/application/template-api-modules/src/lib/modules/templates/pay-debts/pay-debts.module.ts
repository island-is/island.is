import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { FinanceClientV3Module } from '@island.is/clients/finance-v3'
import { DownloadServiceConfig } from '@island.is/nest/config'

import { SharedTemplateAPIModule } from '../../shared'

import { PayDebtsService } from './pay-debts.service'
@Module({
  imports: [
    FinanceClientV3Module,
    SharedTemplateAPIModule,
    ConfigModule.forFeature(DownloadServiceConfig),
  ],
  providers: [PayDebtsService],
  exports: [PayDebtsService],
})
export class PayDebtsModule {}
