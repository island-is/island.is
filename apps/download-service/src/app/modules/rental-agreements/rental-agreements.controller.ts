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

  @Post('/:contractId')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get the latest rental agreement pdf from HMS',
  })
  async getLatestRentalAgreementPdf(
    @Param('contractId') contractId: string | undefined,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    if (!contractId) {
      throw new BadRequestException('Missing contractId')
    }

    const documentResponse = await this.service.getLatestRentalAgreementPdf(
      user,
      contractId,
    )

    if (documentResponse) {
      this.auditService.audit({
        action: 'getLatestRentalAgreementPdf',
        auth: user,
        resources: contractId,
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

  @Post('/:contractId/:documentId')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get a specific rental agreement document pdf from HMS',
  })
  async getRentalAgreementDocumentPdf(
    @Param('contractId') contractId: string | undefined,
    @Param('documentId') documentId: string | undefined,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    if (!contractId) {
      throw new BadRequestException('Missing contractId')
    }
    if (!documentId) {
      throw new BadRequestException('Missing documentId')
    }

    const documentResponse = await this.service.getRentalAgreementDocumentPdf(
      user,
      +contractId,
      +documentId,
    )

    if (documentResponse) {
      this.auditService.audit({
        action: 'getRentalAgreementDocumentPdf',
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
