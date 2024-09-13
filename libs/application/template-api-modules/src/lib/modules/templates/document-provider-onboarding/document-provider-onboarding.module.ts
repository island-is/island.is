import { Module } from '@nestjs/common'
import { ClientsDocumentProviderModule } from '@island.is/clients/document-provider'
import { SharedTemplateAPIModule } from '../../shared'
import { DocumentProviderOnboardingService } from './document-provider-onboarding.service'

const SERVICE_DOCUMENTS_BASEPATH =
  process.env.SERVICE_DOCUMENTS_BASEPATH ?? 'http://localhost:3369'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ClientsDocumentProviderModule.register({
      basePath: SERVICE_DOCUMENTS_BASEPATH,
    }),
  ],
  providers: [DocumentProviderOnboardingService],
  exports: [DocumentProviderOnboardingService],
})
export class DocumentProviderOnboardingModule {}
