import { Module } from '@nestjs/common'
import { IcelandicGovernmentInstitutionVacanciesV2Service } from './icelandic-government-institution-vacancies-v2.service'

@Module({
  exports: [IcelandicGovernmentInstitutionVacanciesV2Service],
})
export class ClientsIcelandicGovernmentInstitutionVacanciesV2Module {}
