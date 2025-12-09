import { Module } from '@nestjs/common'
import { ApiConfig } from './apiConfig'
import { ApiProvider } from './apiProvider'

@Module({
  providers: [ApiConfig, ApiProvider],
  exports: [ApiProvider],
})
export class IcelandicGovernmentInstitutionVacanciesClientModule {}
