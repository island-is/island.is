import { Module } from '@nestjs/common'
import { DocumentController } from './modules/documents/document.controller'
import { DocumentsInfraController } from './modules/infra/documentsInfra.controller'
import { XlsxController } from './modules/xlsx/xlsx.controller'
import { DocumentsClientModule } from '@island.is/clients/documents'
import { environment } from '../environments'
import { AuthModule } from '@island.is/auth-nest-tools'

@Module({
  controllers: [DocumentController, DocumentsInfraController, XlsxController],
  imports: [
    AuthModule.register(environment.auth),
    DocumentsClientModule.register({
      basePath: environment.documentService.basePath,
      clientId: environment.documentService.clientId,
      clientSecret: environment.documentService.clientSecret,
      tokenUrl: environment.documentService.tokenUrl,
    }),
  ],
  providers: [],
})
export class AppModule {}
