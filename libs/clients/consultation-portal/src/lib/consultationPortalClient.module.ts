import { Module } from '@nestjs/common'
import { CasesApi, DocumentsApi, TypesApi, UserApi } from '../../gen/fetch'

import {
  DocumentsApiProvider,
  CasesApiProvider,
  TypesApiProvider,
  UserApiProvider,
} from './apiConfiguration'

@Module({
  providers: [
    DocumentsApiProvider,
    CasesApiProvider,
    TypesApiProvider,
    UserApiProvider,
  ],
  exports: [CasesApi, DocumentsApi, TypesApi, UserApi],
})
export class ConsultationPortalClientModule {}
