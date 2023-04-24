import { Body, Controller, Post, Res, Param, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
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

    const htmlContent = rawDocumentDTO?.htmlContent
    const data = rawDocumentDTO?.content || rawDocumentDTO || htmlContent

    if (!data) {
      return res.end()
    }

    this.auditService.audit({
      action: htmlContent ? 'getDocumentHTML' : 'getDocumentPdf',
      auth: user,
      resources: pdfId,
    })

    res.header('Pragma: no-cache')
    res.header('Cache-Control: no-cache')
    res.header('Cache-Control: nmax-age=0')

    if (htmlContent) {
      res.set('Content-Type', 'text/html')
      res.header('Content-length', htmlContent.length.toString())
      res.header(
        'Content-Disposition',
        `inline; filename=${rawDocumentDTO.fileName}.html`,
      )

      res.send(Buffer.from(htmlContent))
      return res.status(200).end()
    }

    const buffer = Buffer.from(rawDocumentDTO.content!, 'base64')
    res.set('Content-Type', 'application/pdf')
    res.header('Content-length', buffer.length.toString())
    res.header(
      'Content-Disposition',
      `inline; filename=${rawDocumentDTO.fileName}.pdf`,
    )

    return res.end(buffer)
  }
}
