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
import { RegulationPdfInput } from '@island.is/regulations/web'
import { RegName, toISODate } from '@island.is/regulations'

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
    let regulation
    try {
      regulation = await this.regulationsAdminApiService.getDraftRegulation(
        regulationId,
        `Bearer ${resource.__accessToken}`,
      )
    } catch (e) {
      console.error('unable to get draft regulation', e)
    }

    if (!regulation) {
      return res.status(500).end('Unable to generate pdf')
    }

    const input: RegulationPdfInput = {
      title: regulation.title,
      text: regulation.text,
      appendixes: [], // TODO where do we get these?
      comments: '', // TODO where do we get this?
      name: regulation.name ?? ('00/0000' as RegName), // TODO how to handle undefined?
      publishedDate: regulation.ideal_publish_date ?? toISODate(new Date()), // TODO how to handle undefined?
    }

    const documentResponse = await this.regulationService.generateDraftRegulationPdf(
      input,
    )

    if (documentResponse.data) {
      const buffer = Buffer.from(
        (documentResponse.data.buffer as unknown) as string,
        'ascii',
      )
      const filename = documentResponse.data.filename ?? 'draft-regulation.pdf'

      res.header('Content-length', buffer.length.toString())
      res.header('Content-Disposition', `inline; filename=${filename}`)
      res.header('Pragma: no-cache')
      res.header('Cache-Control: no-cache')
      res.header('Cache-Control: max-age=0')

      return res.status(200).end(buffer)
    }

    // logging happens in service, here we just pass the error to user "gracefully"
    return res.status(500).end('Unable to generate pdf')
  }
}
