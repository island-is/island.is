import { Controller, Header, Post, Res, Param, UseGuards } from '@nestjs/common'
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('id') id: string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser() user: User,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Res() res: Response,
  ) {
    throw new Error('Not implemented')
    /*
    if (!id) {
      throw new BadRequestException('Missing id')
    }

    const documentResponse = await this.service.getRentalAgreement(user, +id)

    if (documentResponse) {
      this.auditService.audit({
        action: 'getRentalAgreementPdf',
        auth: user,
        resources: id,
      })

      /*
      con contentArrayBuffer = await documentResponse.arrayBuffer()
      const buffer = Buffer.from(contentArrayBuffer)

      res.header('Content-length', buffer.length.toString())
      res.header(
        'Content-Disposition',
        `inline; filename=${user.nationalId}-rental-agreement-${id}.pdf`,
      )
      res.header('Content-Type', 'application/pdf')
      res.header('Pragma', 'no-cache')
      res.header('Cache-Control', 'no-cache')
      res.header('Cache-Control', 'nmax-age=0')
      return res.status(200).end(buffer)

    }
    return res.end()
    */
  }
}
