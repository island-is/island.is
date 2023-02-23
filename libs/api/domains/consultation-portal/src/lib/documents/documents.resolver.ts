import { Args, Query, Resolver } from '@nestjs/graphql'
import { DocumentService } from './documents.service'
import { DocumentInfoResult } from '../models/documentInfoResult.model'

@Resolver(() => DocumentInfoResult)
export class DocumentResolver {
  constructor(private documentService: DocumentService) {}

  @Query(() => [DocumentInfoResult], { name: 'consultationPortalDocument' })
  async getDocument(@Args('documentId') documentId: string): Promise<void> {
    return this.documentService.getDocument(documentId)
  }
}
