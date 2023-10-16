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
import { MMSApi } from '@island.is/clients/mms'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.education)
@Controller('occupational-licenses')
export class OccupationalLicensesEducationController {
  constructor(
    private readonly mmsApi: MMSApi,
    private readonly auditService: AuditService,
  ) {}

  @Post('/education/:licenceId')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      'Get a occupational license from Directorate of Education service',
  })
  async getOccupationalLicenseEducationPdf(
    @Param('licenceId') licenceId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const documentResponse = await this.mmsApi.downloadLicensePDF(
      user.nationalId,
      licenceId,
    )

    if (documentResponse) {
      this.auditService.audit({
        action: 'getOccupationalLicenseEducationPdf',
        auth: user,
        resources: licenceId,
      })

      const contentArrayBuffer = await documentResponse.arrayBuffer()
      const buffer = Buffer.from(contentArrayBuffer)

      res.header('Content-length', buffer.length.toString())
      res.header(
        'Content-Disposition',
        `inline; filename=${user.nationalId}-starfsleyfi-${licenceId}.pdf`,
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
