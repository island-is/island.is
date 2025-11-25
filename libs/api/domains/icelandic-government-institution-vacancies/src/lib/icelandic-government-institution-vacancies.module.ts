import { CmsModule } from '@island.is/cms'
import { Module } from '@nestjs/common'
import { FinancialManagementAuthorityClientModule } from '@island.is/clients/financial-management-authority'
import { IcelandicGovernmentInstitutionVacanciesResolver } from './icelandic-government-institution-vacancies.resolver'

@Module({
  imports: [FinancialManagementAuthorityClientModule, CmsModule],
  providers: [IcelandicGovernmentInstitutionVacanciesResolver],
  exports: [],
})
export class IcelandicGovernmentInstitutionVacanciesModule {}
