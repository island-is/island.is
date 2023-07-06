import { CmsModule } from '@island.is/cms'
import { Module } from '@nestjs/common'
import { IcelandicGovernmentInstitutionVacanciesClientModule } from '@island.is/clients/icelandic-government-institution-vacancies'
import { IcelandicGovernmentInstitutionVacanciesResolver } from './icelandic-government-institution-vacancies.resolver'

@Module({
  imports: [IcelandicGovernmentInstitutionVacanciesClientModule, CmsModule],
  providers: [IcelandicGovernmentInstitutionVacanciesResolver],
  exports: [],
})
export class IcelandicGovernmentInstitutionVacanciesModule {}
