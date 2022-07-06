import {
  Body,
  Controller,
  Header,
  Post,
  Res,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { GetDocumentDto } from './dto/getDocument.dto'
import { Response } from 'express'
import { DocumentClient } from '@island.is/clients/documents'
import { DocumentsScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AuditService } from '@island.is/nest/audit'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(DocumentsScope.main)
@ApiTags('documents')
@Controller('electronic-documents')
export class DocumentController {
  constructor(
    private readonly documentClient: DocumentClient,
    private readonly auditService: AuditService,
  ) {}

  @Post('/:pdfId')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get a PDF document from the Documents service',
  })
  async getPdf(
    @Param('pdfId') pdfId: string,
    @CurrentUser() user: User,
    @Body() resource: GetDocumentDto,
    @Res() res: Response,
  ) {
    const rawDocumentDTO = await this.documentClient.customersDocument({
      kennitala: user.nationalId,
      messageId: pdfId,
      authenticationType: 'HIGH',
    })

    if (!rawDocumentDTO || !rawDocumentDTO.content) {
      return res.end()
    }

    this.auditService.audit({
      action: 'getDocumentPdf',
      auth: user,
      resources: pdfId,
    })

    const buffer = Buffer.from(rawDocumentDTO.content, 'base64')

    res.header('Content-length', buffer.length.toString())
    res.header(
      'Content-Disposition',
      `inline; filename=${resource.documentId}.pdf`,
    )
    res.header('Pragma: no-cache')
    res.header('Cache-Control: no-cache')
    res.header('Cache-Control: nmax-age=0')

    return res.end(buffer)
  }
}
