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

    const documentResponse = await this.service.getRentalAgreementPdf(user, +id)

    if (documentResponse) {
      this.auditService.audit({
        action: 'getRentalAgreementPdf',
        auth: user,
        resources: id,
      })

      //grab the first one
      const document = documentResponse[0].document

      const buffer = Buffer.from(document, 'base64')

      const filename = `${user.nationalId}-rental-agreement-${id}.pdf`

      res.header('Content-Disposition', `attachment; filename=${filename}`)
      res.header('Pragma', 'no-cache')
      res.header('Cache-Control', 'no-cache')
      res.header('Cache-Control', 'nmax-age=0')

      return res.end(buffer)
    }
    return res.end()
  }
}
