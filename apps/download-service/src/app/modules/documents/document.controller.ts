import type { User } from '@island.is/auth-nest-tools'
import slugify from '@sindresorhus/slugify'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { DocumentsScope } from '@island.is/auth/scopes'
import { DocumentClient } from '@island.is/clients/documents'
import { AuditService } from '@island.is/nest/audit'
import {
  Controller,
  Header,
  Param,
  Post,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

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
    @Res() res: Response,
    @Query('action') action: string,
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

    const slugFileName = slugify(rawDocumentDTO.fileName ?? 'postholf-skjal', {
      customReplacements: [
        ['Þ', 'th'],
        ['ö', 'o'],
      ],
    })
    res.header(
      'Content-Disposition',
      `${
        action === 'download' ? 'attachment' : 'inline'
      }; filename=${slugFileName}.pdf`,
    )
    res.header('Pragma', 'no-cache')
    res.header('Cache-Control', 'no-cache')
    res.header('Cache-Control', 'nmax-age=0')

    return res.end(buffer)
  }
}
