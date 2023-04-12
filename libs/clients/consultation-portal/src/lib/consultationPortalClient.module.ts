import { Module } from '@nestjs/common'
import {
  AuthenticationApi,
  CasesApi,
  CaseSubscriptionApi,
  DocumentsApi,
  StatisticsApi,
  TypesApi,
  UserApi,
} from '../../gen/fetch'

import {
  AuthenticationApiProvider,
  DocumentsApiProvider,
  CasesApiProvider,
  StatisticsApiProvider,
  TypesApiProvider,
  UserApiProvider,
  CaseSubscriptionApiProvider,
} from './apiConfiguration'

@Module({
  providers: [
    AuthenticationApiProvider,
    CasesApiProvider,
    CaseSubscriptionApiProvider,
    DocumentsApiProvider,
    StatisticsApiProvider,
    TypesApiProvider,
    UserApiProvider,
  ],
  exports: [
    AuthenticationApi,
    CasesApi,
    CaseSubscriptionApi,
    DocumentsApi,
    StatisticsApi,
    TypesApi,
    UserApi,
  ],
})
export class ConsultationPortalClientModule {}
