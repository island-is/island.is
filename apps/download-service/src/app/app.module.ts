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

import { environment } from '../environments'

import { DocumentController } from './modules/documents/document.controller'
import { FinanceDocumentController } from './modules/finance-documents/document.controller'
import { DocumentsInfraController } from './modules/infra/documentsInfra.controller'

@Module({
  controllers: [
    DocumentController,
    DocumentsInfraController,
    FinanceDocumentController,
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
  ],
  providers: [],
})
export class AppModule {}
