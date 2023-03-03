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
import slugify from '@sindresorhus/slugify'

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

    if (!rawDocumentDTO) {
      return res
        .status(500)
        .end('Unable to generate pdf - No content from service')
    }
    if (rawDocumentDTO.content) {
      this.auditService.audit({
        action: 'getDocumentPdf',
        auth: user,
        resources: pdfId,
      })
      const buffer = Buffer.from(rawDocumentDTO.content, 'base64')
      const filename = slugify(
        rawDocumentDTO.fileName ?? `postholf-${user.nationalId}`,
      )
      res.header('Content-length', buffer.length.toString())
      res.header('Content-Disposition', `inline; filename=${filename}.pdf`)
      res.header('Pragma: no-cache')
      res.header('Cache-Control: no-cache')
      res.header('Cache-Control: nmax-age=0')

      return res.status(200).end(buffer)
    }
    if (rawDocumentDTO.htmlContent) {
      this.auditService.audit({
        action: 'getDocumentHTML',
        auth: user,
        resources: pdfId,
      })
      const filename = slugify(
        rawDocumentDTO.fileName ?? `postholf-${user.nationalId}`,
      )
      res.header('Content-length', rawDocumentDTO.htmlContent.length.toString())
      res.header('Content-Disposition', `inline; filename=${filename}.html`)
      res.set('Content-Type', 'text/html')
      res.header('Pragma: no-cache')
      res.header('Cache-Control: no-cache')
      res.header('Cache-Control: nmax-age=0')

      res.send(Buffer.from(rawDocumentDTO.htmlContent))
      return res.status(200).end()
    }

    return res.status(500).end('Unable to generate pdf')
  }
}
