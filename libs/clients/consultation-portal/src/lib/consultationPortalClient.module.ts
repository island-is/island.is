import { Module } from '@nestjs/common'
import { CasesApi, DocumentsApi } from '../../gen/fetch'

import { ConsultationPortalApiProvider } from './apiConfiguration'

@Module({
  providers: [ConsultationPortalApiProvider],
  exports: [CasesApi],
})
export class ConsultationPortalClientModule {}
