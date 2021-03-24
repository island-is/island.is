import { Module } from '@nestjs/common'
import { DocumentController } from './modules/documents/document.controller'
import { DocumentsClientModule } from '@island.is/clients/postholf'
import { environment } from '../environments'

@Module({
  controllers: [DocumentController],
  imports: [
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
