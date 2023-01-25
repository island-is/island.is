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
  DownloadServiceConfig,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'

import { DocumentController } from './modules/documents/document.controller'
import { DocumentsInfraController } from './modules/infra/documentsInfra.controller'
import { FinanceDocumentController } from './modules/finance-documents/document.controller'
import { environment } from '../environments'
import { VehicleController } from './modules/vehicles-documents/vehicle-document.controller'
import { RegulationDocumentsController } from './modules/regulation-documents/regulation-documents.controller'
import {
  VehiclesClientConfig,
  VehiclesClientModule,
} from '@island.is/clients/vehicles'
import { RegulationsService } from '@island.is/clients/regulations'
import {
  RegulationsAdminClientConfig,
  RegulationsAdminClientService,
} from '@island.is/clients/regulations-admin'

@Module({
  controllers: [
    DocumentController,
    DocumentsInfraController,
    FinanceDocumentController,
    VehicleController,
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
    VehiclesClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        FinanceClientConfig,
        IdsClientConfig,
        XRoadConfig,
        VehiclesClientConfig,
        DownloadServiceConfig,
        RegulationsAdminClientConfig,
      ],
    }),
  ],
  providers: [
    RegulationsAdminClientService,
    {
      provide: RegulationsService,
      // See method doc for disable reason.
      // eslint-disable-next-line local-rules/no-async-module-init
      useFactory: async () =>
        new RegulationsService({
          url: environment.regulationsAdmin.regulationsApiUrl,
          presignedKey: environment.regulationsAdmin.presignedKey,
          publishKey: environment.regulationsAdmin.publishKey,
          draftKey: environment.regulationsAdmin.draftKey,
        }),
    },
  ],
})
export class AppModule {}
