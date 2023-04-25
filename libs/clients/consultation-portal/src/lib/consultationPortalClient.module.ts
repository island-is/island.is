import { Module } from '@nestjs/common'
import {
  CasesApi,
  CaseSubscriptionApi,
  DocumentsApi,
  StatisticsApi,
  TypesApi,
  UserApi,
} from '../../gen/fetch'

import {
  DocumentsApiProvider,
  CasesApiProvider,
  StatisticsApiProvider,
  TypesApiProvider,
  UserApiProvider,
  CaseSubscriptionApiProvider,
} from './apiConfiguration'

@Module({
  providers: [
    CasesApiProvider,
    CaseSubscriptionApiProvider,
    DocumentsApiProvider,
    StatisticsApiProvider,
    TypesApiProvider,
    UserApiProvider,
  ],
  exports: [
    CasesApi,
    CaseSubscriptionApi,
    DocumentsApi,
    StatisticsApi,
    TypesApi,
    UserApi,
  ],
})
export class ConsultationPortalClientModule {}
