import { Module } from '@nestjs/common'

import { AuthModule } from '@island.is/auth-nest-tools'
import { DocumentsClientModule } from '@island.is/clients/documents'
import {
  FinanceClientConfig,
  FinanceClientModule,
} from '@island.is/clients/finance'
import { AuditModule } from '@island.is/nest/audit'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'

import { DocumentController } from './modules/documents/document.controller'
import { DocumentsInfraController } from './modules/infra/documentsInfra.controller'
import { FinanceDocumentController } from './modules/finance-documents/document.controller'
import { RegulationDocumentsController } from './modules/regulation-documents/regulation-documents.controller'
import {
  RegulationsAdminClientConfig,
  RegulationsAdminClientModule,
} from '@island.is/clients/regulations-admin'
import { RegulationsService } from '@island.is/clients/regulations'
import { environment } from '../environments'

@Module({
  controllers: [
    DocumentController,
    DocumentsInfraController,
    FinanceDocumentController,
    RegulationDocumentsController,
  ],
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    DocumentsClientModule.register({
      basePath: environment.documentService.basePath,
      clientId: environment.documentService.clientId,
      clientSecret: environment.documentService.clientSecret,
      tokenUrl: environment.documentService.tokenUrl,
    }),
    FinanceClientModule,
    RegulationsAdminClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        FinanceClientConfig,
        RegulationsAdminClientConfig,
        IdsClientConfig,
        XRoadConfig,
      ],
    }),
  ],
  providers: [
    {
      provide: RegulationsService,
      useFactory: async () =>
        new RegulationsService({
          url: environment.regulationsAdmin.regulationsApiUrl,
        }),
    },
  ],
})
export class AppModule {}
