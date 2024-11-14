import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { RegulationsService } from '@island.is/clients/regulations'
import { RegulationsAdminClientService } from '@island.is/clients/regulations-admin'
import {
  RegulationDraft,
  RegulationPdfInput,
} from '@island.is/regulations/admin'
import { Controller, Header, Param, Post, Res, UseGuards } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(
  AdminPortalScope.regulationAdmin,
  AdminPortalScope.regulationAdminManage,
)
@Controller('regulation')
export class RegulationDocumentsController {
  constructor(
    private regulationService: RegulationsService,
    private regulationsAdminClientService: RegulationsAdminClientService,
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
    @Res() res: Response,
  ) {
    let draftRegulation: RegulationDraft | null = null

    try {
      draftRegulation =
        await this.regulationsAdminClientService.getDraftRegulation(
          regulationId,
          user,
        )
    } catch (e) {
      console.error('unable to get draft regulation', e)
    }

    if (!draftRegulation) {
      return res.status(500).end('Unable to generate pdf')
    }

    function updateMinistryName(ministryRaw?: string): string | undefined {
      if (!ministryRaw) {
        return undefined
      }
      const suffix = 'ráðuneyti'
      const newSuffix = 'ráðuneytinu'

      if (ministryRaw.endsWith(suffix)) {
        return ministryRaw.slice(0, -suffix.length) + newSuffix
      }

      return ministryRaw
    }

    const draftMinistry = updateMinistryName(draftRegulation.ministry)

    const input: RegulationPdfInput = {
      title: draftRegulation.title,
      text: draftRegulation.text,
      appendixes: draftRegulation.appendixes,
      comments: draftRegulation.comments,
      name: draftRegulation.name,
      publishedDate: draftRegulation.idealPublishDate,
      ministry: draftMinistry,
    }

    const documentResponse =
      await this.regulationService.generateDraftRegulationPdf(input)

    if (
      documentResponse.data &&
      typeof documentResponse.data.base64 === 'string'
    ) {
      const buffer = Buffer.from(documentResponse.data.base64, 'base64')
      const filename = documentResponse.data.fileName

      res.header('Content-Type', documentResponse.data.mimeType)
      res.header('Content-length', buffer.length.toString())
      res.header('Content-Disposition', `inline; filename=${filename}`)
      res.header('Cache-Control', 'no-cache')

      return res.status(200).end(buffer)
    }

    // logging happens in service, here we just pass the error to user "gracefully"
    return res.status(500).end('Unable to generate pdf')
  }
}
