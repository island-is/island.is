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
import { environment } from '../environments'
import { ApplicationController } from './modules/application/application.controller'
import {
  ApplicationClientConfig,
  ApplicationClientModule,
} from '@island.is/clients/application'

@Module({
  controllers: [
    DocumentController,
    DocumentsInfraController,
    FinanceDocumentController,
    ApplicationController,
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
      load: [
        ApplicationClientConfig,
        FinanceClientConfig,
        IdsClientConfig,
        XRoadConfig,
      ],
    }),
    ApplicationClientModule,
  ],
  providers: [],
})
export class AppModule {}
