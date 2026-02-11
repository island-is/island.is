import {
  Controller,
  Header,
  Post,
  Res,
  Param,
  UseGuards,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'
import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AuditService } from '@island.is/nest/audit'
import { HmsRentalAgreementService } from '@island.is/clients/hms-rental-agreement'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.hms)
@FeatureFlag(Features.isServicePortalMyContractsPageEnabled)
@Controller('rental-agreements')
export class RentalAgreementsController {
  constructor(
    private readonly service: HmsRentalAgreementService,
    private readonly auditService: AuditService,
  ) {}

  @Post('/:documentId/:contractId')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get a rental agreement pdf from HMSs',
  })
  async getRentalAgreementPdf(
    @Param('documentId', ParseIntPipe) documentId: number,
    @Param('contractId', ParseIntPipe) contractId: number,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    if (!documentId || !contractId) {
      throw new BadRequestException('Missing documentId or contractId')
    }

    const documentResponse = await this.service.getRentalAgreementPdf(
      user,
      documentId,
      contractId,
    )

    if (documentResponse) {
      this.auditService.audit({
        action: 'getRentalAgreementPdf',
        auth: user,
        resources: [documentId.toString(), contractId.toString()],
      })

      const buffer = Buffer.from(documentResponse.document, 'base64')
      const filename = `${documentResponse.name ?? 'rental-agreement'}-${contractId}-${documentId}.pdf`

      res.header(
        'Content-Disposition',
        `inline; filename="${filename.replace(/"/g, '_')}"`,
      )
      res.header('Pragma', 'no-cache')
      res.header('Cache-Control', 'no-cache')
      return res.status(200).end(buffer)
    }
    res.status(404).contentType('text/plain').end('Rental agreement not found')
  }
}
