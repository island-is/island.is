import { Module } from '@nestjs/common'
import { apiProviders } from './providers'
import { FinancialManagementAuthorityClientService } from './financialManagementAuthorityClient.service'
import { VacancyApi } from '../../gen/fetch'

@Module({
  providers: [...apiProviders, FinancialManagementAuthorityClientService],
  exports: [VacancyApi, FinancialManagementAuthorityClientService],
})
export class FinancialManagementAuthorityClientModule {}
