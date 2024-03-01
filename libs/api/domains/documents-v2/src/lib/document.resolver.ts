import { IdsUserGuard, ScopesGuard, Scopes } from "@island.is/auth-nest-tools"
import { Query, UseGuards,  } from "@nestjs/common"
import { AuditService } from '@island.is/nest/audit'
import { DocumentsScope } from '@island.is/auth/scopes'
import { Resolver } from "@nestjs/graphql"
import { DocumentService } from "./document.service"

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class DocumentResolver {
  constructor(
    private documentService: DocumentService,
    private readonly auditService: AuditService,
  ) {}

  @Scopes(DocumentsScope.main)
  @Query(() => DocumentDetails, { nullable: true })
  async getDocument(
    @Args('input') input: GetDocumentInput,
    @CurrentUser() user: User,
  ): Promise<Document> {
    const document = await this.documentService.
  }
