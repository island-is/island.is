import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { FinanceClientService } from '@island.is/clients/finance'
import { AuditService } from '@island.is/nest/audit'
import {
  Controller,
  Header,
  Param,
  Post,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.financeOverview, ApiScope.financeSalary)
@Controller('finance')
export class FinanceDocumentController {
  constructor(
    private readonly financeService: FinanceClientService,
    private readonly auditService: AuditService,
  ) {}

  @Post('/:pdfId')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get a PDF document from the Finance service',
  })
  async getFinancePdf(
    @CurrentUser() user: User,
    @Res() res: Response,
    @Param('pdfId') pdfId: string,
    @Query('action') action?: string,
  ) {
    const documentResponse =
      action === 'annualDoc'
        ? await this.financeService.getAnnualStatusDocument(
            user.nationalId,
            pdfId,
            user,
          )
        : await this.financeService.getFinanceDocument(
            user.nationalId,
            pdfId,
            user,
          )

    const documentBase64 = documentResponse?.docment?.document

    if (documentBase64) {
      this.auditService.audit({
        action: 'getFinancePdf',
        auth: user,
        resources: pdfId,
      })

      const buffer = Buffer.from(documentBase64, 'base64')

      res.header('Content-length', buffer.length.toString())
      res.header('Content-Disposition', `inline; filename=${pdfId}.pdf`)
      res.header('Pragma', 'no-cache')
      res.header('Cache-Control', 'no-cache')
      res.header('Cache-Control', 'nmax-age=0')

      return res.status(200).end(buffer)
    }
    return res.end()
  }
}
