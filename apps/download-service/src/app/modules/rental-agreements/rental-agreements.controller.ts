import {
  Controller,
  Header,
  Post,
  Res,
  Param,
  UseGuards,
  ParseIntPipe,
  BadRequestException,
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
    @Param('documentId') documentId: string | undefined,
    @Param('contractId') contractId: string | undefined,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    if (!documentId || !contractId) {
      throw new BadRequestException('Missing documentId or contractId')
    }

    const documentResponse = await this.service.getRentalAgreementPdf(
      user,
      +documentId,
      +contractId,
    )

    if (documentResponse) {
      this.auditService.audit({
        action: 'getRentalAgreementPdf',
        auth: user,
        resources: [documentId, contractId],
      })

      const buffer = Buffer.from(documentResponse.document, 'base64')
      const filename = `${user.nationalId}-${contractId}-${documentId}-${documentResponse.name}.pdf`

      res.header('Content-Disposition', `inline; filename=${filename}`)
      res.header('Pragma', 'no-cache')
      res.header('Cache-Control', 'no-cache')
      res.header('Cache-Control', 'nmax-age=0')
      return res.status(200).end(buffer)
    }
    res.status(404)
    return res.end('Rental agreement not found')
  }
}
