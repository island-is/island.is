import { Module } from '@nestjs/common'
import { MunicipalitiesFinancialAidResolver } from './municipalitiesFinancialAid.resolver'
import { MunicipalitiesFinancialAidService } from './municipalitiesFinancialAid.service'

import {
  ApplicationApiProvider,
  MunicipalityApiProvider,
  FilesApiProvider,
} from '@island.is/clients/municipalities-financial-aid'

@Module({
  providers: [
    MunicipalitiesFinancialAidResolver,
    MunicipalitiesFinancialAidService,
    ApplicationApiProvider,
    MunicipalityApiProvider,
    FilesApiProvider,
  ],
})
export class MunicipalitiesFinancialAidModule {}
