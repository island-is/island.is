import { Injectable } from '@nestjs/common'
import {
  DefaultApi,
  VacanciesGetAcceptEnum,
  VacanciesGetLanguageEnum,
} from '../../gen/fetch'

@Injectable()
export class IcelandicGovernmentInstitutionVacanciesV2Service {
  constructor(private readonly api: DefaultApi) {}

  async getVacancies() {
    const response = await this.api.vacanciesGet({
      accept: VacanciesGetAcceptEnum.Json,
      language: VacanciesGetLanguageEnum.IS,
      stofnun: '',
      query: 'asdf',
    })
  }
}
