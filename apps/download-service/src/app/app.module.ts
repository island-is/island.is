import { Module } from '@nestjs/common'

import { AuthModule } from '@island.is/auth-nest-tools'
import { DocumentsClientModule } from '@island.is/clients/documents'
import {
  FinanceClientConfig,
  FinanceClientModule,
} from '@island.is/clients/finance'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'

import { DocumentController } from './modules/documents/document.controller'
import { DocumentsInfraController } from './modules/infra/documentsInfra.controller'
import { FinanceDocumentController } from './modules/finance-documents/document.controller'
import { RegulationDocumentsController } from './modules/regulation-documents/regulation-documents.controller'
import { RegulationsAdminModule } from '@island.is/api/domains/regulations-admin'
import { environment } from '../environments'

@Module({
  controllers: [
    DocumentController,
    DocumentsInfraController,
    FinanceDocumentController,
    RegulationDocumentsController,
  ],
  imports: [
    AuthModule.register(environment.auth),
    DocumentsClientModule.register({
      basePath: environment.documentService.basePath,
      clientId: environment.documentService.clientId,
      clientSecret: environment.documentService.clientSecret,
      tokenUrl: environment.documentService.tokenUrl,
    }),
    FinanceClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [FinanceClientConfig, IdsClientConfig, XRoadConfig],
    }),
    RegulationsAdminModule.register({
      baseApiUrl: environment.regulationsAdmin.baseApiUrl,
      regulationsApiUrl: environment.regulationsAdmin.regulationsApiUrl,
    }),
  ],
  providers: [],
})
export class AppModule {}
