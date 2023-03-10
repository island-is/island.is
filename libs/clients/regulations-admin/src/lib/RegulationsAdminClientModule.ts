import { Module } from '@nestjs/common'
import {
  DraftAuthorApi,
  DraftRegulationCancelApi,
  DraftRegulationChangeApi,
  DraftRegulationsApi,
  InternalApi,
} from '../../gen/fetch/apis'
import {
  DraftAuthorApiProvider,
  DraftRegulationCancelApiProvider,
  DraftRegulationChangeApiProvider,
  DraftRegulationsApiProvider,
  InternalApiProvider,
} from './apiConfiguration'
import { RegulationsAdminClientService } from './RegulationsAdminClientService'

@Module({
  providers: [
    RegulationsAdminClientService,
    DraftAuthorApiProvider,
    DraftRegulationCancelApiProvider,
    DraftRegulationChangeApiProvider,
    DraftRegulationsApiProvider,
    InternalApiProvider,
  ],
  exports: [
    RegulationsAdminClientService,
    DraftAuthorApi,
    DraftRegulationCancelApi,
    DraftRegulationChangeApi,
    DraftRegulationsApi,
    InternalApi,
  ],
})
export class RegulationsAdminClientModule {}
