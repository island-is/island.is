import { Args, Query, Resolver, Mutation } from '@nestjs/graphql'
import { DocumentService } from './document.service'
import { Document } from './document.model'
import { GetDocumentInput } from './dto/getDocumentInput'

@Resolver()
export class DocumentResolver {
  constructor(private documentService: DocumentService) {}

  @Query(() => Document, { nullable: true })
  getDocument(@Args('input') input: GetDocumentInput): Document {
    return this.documentService.findByDocumentId(input.id)
  }
}
