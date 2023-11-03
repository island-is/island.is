import {
  Controller,
  Header,
  Post,
  Res,
  Param,
  UseGuards,
  Inject,
  Body,
} from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'
import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  AuthMiddleware,
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AuditService } from '@island.is/nest/audit'
import { PaymentApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { GetGetHealthPaymentDocumentDto } from './dto/getHealthPaymentDocument.dto'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.health)
@Controller('health')
export class HealthPaymentsOverviewController {
  constructor(
    private readonly paymentApi: PaymentApi,
    private readonly auditService: AuditService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

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
    @Body() resource: GetGetHealthPaymentDocumentDto,
    @Res() res: Response,
  ) {
    this.logger.debug('getHealthPaymentOverviewPdf', {
      res: typeof parseInt(documentId),
    })

    const authUser = {
      ...user,
      authorization: `Bearer ${resource.__accessToken}`,
    }

    const documentResponse = await this.paymentApi
      .withMiddleware(new AuthMiddleware(authUser))
      .getPaymentsOverviewDocument({
        documentId: parseInt(documentId),
      })

    this.logger.debug('getHealthPaymentOverviewPdf', { res: documentResponse })

    if (documentResponse) {
      this.auditService.audit({
        action: 'getHealthPaymentOverviewPdf',
        auth: user,
        resources: documentId,
      })

      if (!documentResponse.data)
        return res.status(404).end(
          JSON.stringify({
            statusCode: 404,
            message: 'Document not found',
          }),
        )

      const buffer = Buffer.from(documentResponse.data, 'base64')

      // const contentArrayBuffer =
      //   await documentResponse.contentType.arrayBuffer()
      // const buffer = Buffer.from(contentArrayBuffer)

      res.header('Content-length', buffer.length.toString())
      res.header(
        'Content-Disposition',
        `inline; filename=${user.nationalId}-health-payment-overview-${documentResponse.fileName}.pdf`,
      )
      res.header('Content-Type: application/pdf')
      res.header('Pragma: no-cache')
      res.header('Cache-Control: no-cache')
      res.header('Cache-Control: nmax-age=0')
      return res.status(200).end(buffer)
    }
    return res.end()
  }
}
