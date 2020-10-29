import { Args, Query, Resolver } from '@nestjs/graphql'
import { DocumentService } from './document.service'
import { Document } from './models/document.model'
import { GetDocumentInput } from './dto/getDocumentInput'
import { DocumentDetails } from './models/documentDetails.model'
import { DocumentCategory } from './models/documentCategory.model'
import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-api-lib'
import { UseGuards } from '@nestjs/common'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class DocumentResolver {
  constructor(private documentService: DocumentService) {}

  @Query(() => DocumentDetails, { nullable: true })
  async getDocument(
    @Args('input') input: GetDocumentInput,
    @CurrentUser() user: User,
  ): Promise<DocumentDetails> {
    const result = await this.documentService.findByDocumentId(
      user.nationalId,
      input.id,
    )

    return result
  }

  @Query(() => [Document], { nullable: true })
  listDocuments(@CurrentUser() user: User): Promise<Document[]> {
    return this.documentService.listDocuments(user.nationalId)
  }

  @Query(() => [DocumentCategory], { nullable: true })
  getDocumentCategories(
    @CurrentUser() user: User,
  ): Promise<DocumentCategory[]> {
    return this.documentService.getCategories(user.nationalId)
  }
}
