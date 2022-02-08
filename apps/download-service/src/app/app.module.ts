import { Module } from '@nestjs/common'
import { DocumentController } from './modules/documents/document.controller'
import { DocumentsInfraController } from './modules/infra/documentsInfra.controller'
import { FinanceDocumentController } from './modules/finance-documents/document.controller'
import { DocumentsClientModule } from '@island.is/clients/documents'
import { FinanceModule } from '@island.is/api/domains/finance'
import { environment } from '../environments'
import { AuthModule } from '@island.is/auth-nest-tools'
import { ApplicationController } from './modules/application/application.controller'
import {
  ApplicationClientConfig,
  ApplicationClientModule,
} from '@island.is/clients/application'
import { ConfigModule } from '@nestjs/config'

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
    FinanceModule.register({
      xroadApiPath: environment.fjarmalDomain.xroadApiPath,
      xroadBaseUrl: environment.xroad.baseUrl,
      xroadClientId: environment.xroad.clientId,
      ttl: environment.fjarmalDomain.ttl,
      downloadServiceBaseUrl: '',
    }),
    ApplicationClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ApplicationClientConfig],
    }),
  ],
  providers: [],
})
export class AppModule {}
