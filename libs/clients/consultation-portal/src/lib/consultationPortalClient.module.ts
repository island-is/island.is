import { Module } from '@nestjs/common'
import {
  AuthenticationApi,
  CasesApi,
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
} from './apiConfiguration'

@Module({
  providers: [
    AuthenticationApiProvider,
    DocumentsApiProvider,
    CasesApiProvider,
    StatisticsApiProvider,
    TypesApiProvider,
    UserApiProvider,
  ],
  exports: [
    AuthenticationApi,
    CasesApi,
    DocumentsApi,
    StatisticsApi,
    TypesApi,
    UserApi,
  ],
})
export class ConsultationPortalClientModule {}
