import { Args, Query, Resolver } from '@nestjs/graphql'
import { DocumentService } from './document.service'
import { Document } from './models/document.model'
import { GetDocumentInput } from './dto/getDocumentInput'
import { ListDocumentsInput } from './dto/listDocumentsInput'
import { DocumentDetails } from './models/documentDetails.model'
import { DocumentCategory } from './models/documentCategory.model'

@Resolver()
export class DocumentResolver {
  constructor(private documentService: DocumentService) { }

  @Query(() => DocumentDetails, { nullable: true })
  async getDocument(@Args('input') input: GetDocumentInput): Promise<DocumentDetails> {
    const kennitala = '2606862759' // Pending proper authentication
    console.log('getting ', input)
    const result = await this.documentService.findByDocumentId(kennitala, input.id)

    return result
  }

  @Query(() => [Document], { nullable: true })
  listDocuments(@Args('input') input: ListDocumentsInput): Promise<Document[]> {
    input.natReg = '2606862759'  // Pending proper authentication
    return this.documentService.listDocuments(input)
  }

  @Query(() => [DocumentCategory], { nullable: true })
  getDocumentCategories(): Promise<DocumentCategory[]> {
    const natReg = '2606862759'  // Pending proper authentication
    return this.documentService.getCategories(natReg)
  }

}
