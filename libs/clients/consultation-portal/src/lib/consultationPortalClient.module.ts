import { Module } from '@nestjs/common'
import { CasesApi, DocumentsApi } from '../../gen/fetch'

import { DocumentsApiProvider, CasesApiProvider } from './apiConfiguration'

@Module({
  providers: [DocumentsApiProvider, CasesApiProvider],
  exports: [CasesApi, DocumentsApi],
})
export class ConsultationPortalClientModule {}
