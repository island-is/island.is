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

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.hms)
@Controller('rental-agreements')
export class RentalAgreementsController {
  constructor(
    private readonly service: HmsRentalAgreementService,
    private readonly auditService: AuditService,
  ) {}

  @Post('/:contractId/:documentId')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get a rental agreement document pdf from HMS',
  })
  async getRentalAgreementPdf(
    @Param('contractId') contractId: string | undefined,
    @Param('documentId') documentId: string | undefined,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    if (!contractId || !documentId) {
      throw new BadRequestException('Missing contractId or documentId')
    }

    const documentResponse = await this.service.getRentalAgreementPdf(
      user,
      +contractId,
      +documentId,
    )

    if (documentResponse) {
      this.auditService.audit({
        action: 'getRentalAgreementPdf',
        auth: user,
        resources: `${contractId}/${documentId}`,
      })

      const buffer = Buffer.from(documentResponse.document, 'base64')
      const filename = documentResponse.name.endsWith('.pdf')
        ? documentResponse.name
        : `${documentResponse.name}.pdf`

      res.header('Content-Disposition', `attachment; filename="${filename}"`)
      res.header('Pragma', 'no-cache')
      res.header('Cache-Control', 'no-cache, max-age=0')
      return res.end(buffer)
    }

    res.status(404)
    return res.end('Rental agreement document not found')
  }
}
