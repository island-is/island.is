import { Module } from '@nestjs/common'
import { VacanciesClientService } from './vacancies.service'
import { DefaultApiConfig, DefaultApiProvider } from './default-api.provider'

@Module({
  providers: [DefaultApiConfig, DefaultApiProvider, VacanciesClientService],
  exports: [VacanciesClientService],
})
export class VacanciesClientModule {}
