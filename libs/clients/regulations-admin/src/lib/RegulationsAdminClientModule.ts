import { Module } from '@nestjs/common'
import {
  DraftAuthorApi,
  DraftRegulationCancelApi,
  DraftRegulationChangeApi,
  DraftRegulationsApi,
} from '../../gen/fetch/apis'
import {
  DraftAuthorApiProvider,
  DraftRegulationCancelApiProvider,
  DraftRegulationChangeApiProvider,
  DraftRegulationsApiProvider,
} from './apiConfiguration'
import { RegulationsAdminClientService } from './RegulationsAdminClientService'

@Module({
  providers: [
    RegulationsAdminClientService,
    DraftAuthorApiProvider,
    DraftRegulationCancelApiProvider,
    DraftRegulationChangeApiProvider,
    DraftRegulationsApiProvider,
  ],
  exports: [
    RegulationsAdminClientService,
    DraftAuthorApi,
    DraftRegulationCancelApi,
    DraftRegulationChangeApi,
    DraftRegulationsApi,
  ],
})
export class RegulationsAdminClientModule {}
