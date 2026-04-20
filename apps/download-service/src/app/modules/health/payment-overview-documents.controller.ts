import type { User } from '@island.is/auth-nest-tools'
import {
  AuthMiddleware,
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { PaymentsOverviewApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { AuditService } from '@island.is/nest/audit'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import {
  Controller,
  Header,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.healthPayments)
@Controller('health')
export class HealthPaymentsOverviewController {
  constructor(
    private readonly paymentApi: PaymentsOverviewApi,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  @Post('/payments/totals')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      'Gets payment overview totals PDF for date range and service type',
  })
  async getHealthPaymentOverviewTotalsPdf(
    @CurrentUser() user: User,
    @Res() res: Response,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @Query('serviceTypeCode') serviceTypeCode: string,
  ) {
    const featureAllowed = await this.featureFlagService.getValue(
      Features.isServicePortalHealthPaymentOverviewTotalPageEnabled,
      false,
      user,
    )

    if (!featureAllowed) {
      return res.status(403).json({
        statusCode: 403,
        message: 'Not allowed',
      })
    }

    const documentResponse = await this.paymentApi
      .withMiddleware(new AuthMiddleware(user))
      .getPaymentsOverviewTotalsPdf({
        dateFrom: new Date(dateFrom),
        dateTo: new Date(dateTo),
        serviceTypeCode: serviceTypeCode ?? '',
      })

    if (documentResponse) {
      this.auditService.audit({
        action: 'getHealthPaymentOverviewTotalsPdf',
        auth: user,
        resources: 'totals',
      })

      if (!documentResponse.data) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Document not found',
        })
      }

      const buffer = Buffer.from(documentResponse.data, 'base64')
      const fileName =
        documentResponse.fileName ?? 'payment-overview-totals.pdf'

      res.header('Content-length', buffer.length.toString())
      res.header(
        'Content-Disposition',
        `inline; filename=${user.nationalId}-${fileName}`,
      )
      res.header('Content-Type', 'application/pdf')
      res.header('Pragma', 'no-cache')
      res.header('Cache-Control', 'no-cache')
      res.header('Cache-Control', 'max-age=0')
      return res.status(200).end(buffer)
    }
    return res.end()
  }

  @Post('/payments/:documentId')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      'Gets payment overview document for specific bill with documentId',
  })
  async getHealthPaymentOverviewPdf(
    @Param('documentId') documentId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const featureAllowed = await this.featureFlagService.getValue(
      Features.healthPaymentOverview,
      false,
      user,
    )

    if (!featureAllowed) {
      return res.status(403).json({
        statusCode: 403,
        message: 'Not allowed',
      })
    }

    const documentResponse = await this.paymentApi
      .withMiddleware(new AuthMiddleware(user))
      .getPaymentsOverviewDocument({
        documentId: parseInt(documentId),
      })

    if (documentResponse) {
      this.auditService.audit({
        action: 'getHealthPaymentOverviewPdf',
        auth: user,
        resources: documentId,
      })

      if (!documentResponse.data)
        return res.status(404).json({
          statusCode: 404,
          message: 'Document not found',
        })

      const buffer = Buffer.from(documentResponse.data, 'base64')

      res.header('Content-length', buffer.length.toString())
      res.header(
        'Content-Disposition',
        `inline; filename=${user.nationalId}-health-payment-overview-${documentResponse.fileName}.pdf`,
      )
      res.header('Content-Type', 'application/pdf')
      res.header('Pragma', 'no-cache')
      res.header('Cache-Control', 'no-cache')
      res.header('Cache-Control', 'max-age=0')
      return res.status(200).end(buffer)
    }
    return res.end()
  }
}
