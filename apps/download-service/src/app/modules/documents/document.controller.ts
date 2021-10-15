import {
  Body,
  Controller,
  Header,
  Inject,
  Post,
  Res,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { GetDocumentDto } from './dto/getDocument.dto'
import { Response } from 'express'
import { DocumentClient } from '@island.is/clients/documents'
import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard)
@ApiTags('documents')
@Controller('electronic-documents')
export class DocumentController {
  constructor(
    @Inject(DocumentClient)
    private readonly documentClient: DocumentClient,
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
