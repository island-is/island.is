import {
  Controller,
  Header,
  Post,
  Res,
  Param,
  UseGuards,
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

  @Post('/:id')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get a rental agreement pdf from HMSs',
  })
  async getRentalAgreementPdf(
    @Param('id') id: string | undefined,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    if (!id) {
      throw new BadRequestException('Missing id')
    }

    const document = await this.service.getRentalAgreementPdf(user, +id)

    if (document) {
      this.auditService.audit({
        action: 'getRentalAgreementPdf',
        auth: user,
        resources: id,
      })

      const buffer = Buffer.from(document, 'base64')

      const filename = `${user.nationalId}-rental-agreement-${id}.pdf`

      res.header('Content-Disposition', `attachment; filename=${filename}`)
      res.header('Pragma', 'no-cache')
      res.header('Cache-Control', 'no-cache')
      res.header('Cache-Control', 'max-age=0')
      return res.end(buffer)
    }
    res.status(404)
    return res.end('Rental agreement not found')
  }
}
