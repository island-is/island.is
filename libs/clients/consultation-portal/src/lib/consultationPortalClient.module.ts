import { Module } from '@nestjs/common'
import { CasesApi, DocumentsApi, TypesApi } from '../../gen/fetch'

import {
  DocumentsApiProvider,
  CasesApiProvider,
  TypesApiProvider,
} from './apiConfiguration'

@Module({
  providers: [DocumentsApiProvider, CasesApiProvider, TypesApiProvider],
  exports: [CasesApi, DocumentsApi, TypesApi],
})
export class ConsultationPortalClientModule {}
