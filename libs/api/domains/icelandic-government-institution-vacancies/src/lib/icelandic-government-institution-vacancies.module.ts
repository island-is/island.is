import { CmsModule } from '@island.is/cms'
import { Module } from '@nestjs/common'
import { FinancialManagementAuthorityClientModule } from '@island.is/clients/financial-management-authority'
import { IcelandicGovernmentInstitutionVacanciesClientModule } from '@island.is/clients/icelandic-government-institution-vacancies'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { IcelandicGovernmentInstitutionVacanciesResolver } from './icelandic-government-institution-vacancies.resolver'

@Module({
  imports: [
    FinancialManagementAuthorityClientModule,
    IcelandicGovernmentInstitutionVacanciesClientModule,
    FeatureFlagModule,
    CmsModule,
  ],
  providers: [IcelandicGovernmentInstitutionVacanciesResolver],
  exports: [],
})
export class IcelandicGovernmentInstitutionVacanciesModule {}
