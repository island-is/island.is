import {
  Body,
  Controller,
  Header,
  Inject,
  Get,
  Post,
  Res,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { FinanceService } from '@island.is/api/domains/finance'
import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { GetFinanceDocumentDto } from './dto/getFinanceDocument.dto'

@UseGuards(IdsUserGuard)
@ApiTags('finance-documents')
@Controller('finance')
export class FinanceDocumentController {
  constructor(
    @Inject(FinanceService)
    private readonly financeService: FinanceService,
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
    const documentResponse = resource.annualDoc
      ? await this.financeService.getAnnualStatusDocument(
          user.nationalId,
          pdfId,
          resource.__accessToken,
        )
      : await this.financeService.getFinanceDocument(
          user.nationalId,
          pdfId,
          resource.__accessToken,
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
