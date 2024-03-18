import {
  Body,
  Controller,
  Header,
  Post,
  Res,
  Param,
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
import { AuditService } from '@island.is/nest/audit'
import { GetEducationGraduationDocumentDto } from './dto/getEducationGraduationDocument'
import {
  UniversityCareersClientService,
  UniversityId,
} from '@island.is/clients/university-careers'
import { Locale } from '@island.is/shared/types'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.education)
@Controller('education')
export class EducationController {
  constructor(
    private readonly universitiesApi: UniversityCareersClientService,
    private readonly auditService: AuditService,
  ) {}

  @Post('/graduation/:lang/:trackNumber')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      'Get a education graduation document from the university of Iceland service',
  })
  async getEducationGraduationPDF(
    @Param('trackNumber') trackNumber: string,
    @Param('lang') lang: string,
    @CurrentUser() user: User,
    @Body() resource: GetEducationGraduationDocumentDto,
    @Res() res: Response,
  ) {
    const authUser: User = {
      ...user,
      authorization: `Bearer ${resource.__accessToken}`,
    }

    const documentResponse = await this.universitiesApi.getStudentTrackPdf(
      authUser,
      parseInt(trackNumber),
      UniversityId.UniversityOfIceland,
      lang as Locale,
    )

    if (documentResponse) {
      this.auditService.audit({
        action: 'getVehicleHistoryPdf',
        auth: user,
        resources: trackNumber,
      })

      const contentArrayBuffer = await documentResponse.arrayBuffer()
      const buffer = Buffer.from(contentArrayBuffer)

      res.header('Content-length', buffer.length.toString())
      res.header(
        'Content-Disposition',
        `inline; filename=${user.nationalId}-brautskraning-${trackNumber}.pdf`,
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
