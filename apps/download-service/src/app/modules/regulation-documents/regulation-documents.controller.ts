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
import { ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'
import { RegulationsAdminApi } from '@island.is/api/domains/regulations-admin'
import { RegulationsService } from '@island.is/clients/regulations'
import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { GetRegulationDraftDocumentDto } from './dto/getRegulationDraftDocument.dto'
import {
  RegulationDraft,
  RegulationPdfInput,
} from '@island.is/regulations/admin'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Controller('regulation')
export class RegulationDocumentsController {
  constructor(
    @Inject(RegulationsService)
    private readonly regulationService: RegulationsService,
    @Inject(RegulationsAdminApi)
    private regulationsAdminApiService: RegulationsAdminApi,
  ) {}

  @Post('/draft/:regulationId')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get a PDF document for a draft regulation',
  })
  async getDraftRegulationPdf(
    @Param('regulationId') regulationId: string,
    @CurrentUser() user: User,
    @Body() resource: GetRegulationDraftDocumentDto,
    @Res() res: Response,
  ) {
    let draftRegulation: RegulationDraft | null = null
    try {
      draftRegulation = await this.regulationsAdminApiService.getDraftRegulation(
        regulationId,
        `Bearer ${resource.__accessToken}`,
      )
    } catch (e) {
      console.error('unable to get draft regulation', e)
    }

    if (!draftRegulation) {
      return res.status(500).end('Unable to generate pdf')
    }

    const input: RegulationPdfInput = {
      title: draftRegulation.title,
      text: draftRegulation.text,
      appendixes: [], // TODO where do we get these?
      comments: '', // TODO where do we get this?
      name: draftRegulation.name,
      publishedDate: draftRegulation.idealPublishDate,
    }

    const documentResponse = await this.regulationService.generateDraftRegulationPdf(
      input,
    )

    if (
      documentResponse.data &&
      typeof documentResponse.data.base64 === 'string'
    ) {
      const buffer = Buffer.from(documentResponse.data.base64, 'base64')
      const filename = documentResponse.data.fileName

      res.header('Content-Type', documentResponse.data.mimeType)
      res.header('Content-length', buffer.length.toString())
      res.header('Content-Disposition', `inline; filename=${filename}`)
      res.header('Cache-Control: no-cache')

      return res.status(200).end(buffer)
    }

    // logging happens in service, here we just pass the error to user "gracefully"
    return res.status(500).end('Unable to generate pdf')
  }
}
