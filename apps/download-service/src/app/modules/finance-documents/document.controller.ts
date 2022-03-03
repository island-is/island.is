import {
  Body,
  Controller,
  Header,
  Inject,
  Param,
  Post,
  Res,
  UseGuards,
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
import { FinanceClientService } from '@island.is/clients/finance'

import { GetFinanceDocumentDto } from './dto/getFinanceDocument.dto'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.financeOverview, ApiScope.financeSalary)
@Controller('finance')
export class FinanceDocumentController {
  constructor(
    @Inject(FinanceClientService)
    private readonly financeService: FinanceClientService,
  ) {}

  @Post('/:pdfId')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get a PDF document from the Finance service',
  })
  async getFinancePdf(
    @Param('pdfId') pdfId: string,
    @CurrentUser() user: User,
    @Body() resource: GetFinanceDocumentDto,
    @Res() res: Response,
  ) {
    const authUser: User = {
      ...user,
      authorization: `Bearer ${resource.__accessToken}`,
    }
    const documentResponse = resource.annualDoc
      ? await this.financeService.getAnnualStatusDocument(
          user.nationalId,
          pdfId,
          authUser,
        )
      : await this.financeService.getFinanceDocument(
          user.nationalId,
          pdfId,
          authUser,
        )

    const documentBase64 = documentResponse?.docment?.document
    if (documentBase64) {
      const buffer = Buffer.from(documentBase64, 'base64')

      res.header('Content-length', buffer.length.toString())
      res.header('Content-Disposition', `inline; filename=${pdfId}.pdf`)
      res.header('Pragma: no-cache')
      res.header('Cache-Control: no-cache')
      res.header('Cache-Control: nmax-age=0')

      return res.status(200).end(buffer)
    }
    return res.end()
  }
}
