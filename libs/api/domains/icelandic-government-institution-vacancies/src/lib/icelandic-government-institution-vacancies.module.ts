import { Module } from '@nestjs/common'
import { IcelandicGovernmentInstitutionVacanciesClientModule } from '@island.is/clients/icelandic-government-institution-vacancies'

@Module({
  imports: [IcelandicGovernmentInstitutionVacanciesClientModule],
  providers: [],
  exports: [],
})
export class IcelandicGovernmentInstitutionVacanciesModule {}
