import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import {
  UniversityCareersClientService,
  UniversityIdShort,
  UniversityShortIdMap,
} from '@island.is/clients/university-careers'
import { PrimarySchoolClientService } from '@island.is/clients/mms/primary-school'
import { AuditService } from '@island.is/nest/audit'
import {
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
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { unmaskString } from '@island.is/shared/utils'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.education)
@Controller('education')
export class EducationController {
  constructor(
    private readonly universitiesApi: UniversityCareersClientService,
    private readonly primarySchoolService: PrimarySchoolClientService,
    private readonly auditService: AuditService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('/graduation/:university/:file')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      'Get a education graduation document from the university of Iceland service',
  })
  async getEducationGraduationPDF(
    @Param('university') uni: UniversityIdShort,
    @Param('file') file: string,
    @CurrentUser()
    user: User,
    @Res() res: Response,
  ) {
    const url = await unmaskString(file, user.nationalId)

    if (!url) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Document not found',
      })
    }

    const documentResponse = await this.universitiesApi.downloadFile(
      user,
      url,
      UniversityShortIdMap[uni],
    )

    if (documentResponse) {
      this.auditService.audit({
        action: 'getStudentTrackEducationGraduationPdf',
        auth: user,
        resources: `${UniversityShortIdMap[uni]}/${url}`,
      })

      const contentArrayBuffer = await documentResponse.arrayBuffer()
      const buffer = Buffer.from(contentArrayBuffer)

      res.header('Content-length', buffer.length.toString())
      res.header(
        'Content-Disposition',
        `inline; filename=${user.nationalId}-skoli-${UniversityShortIdMap[uni]}-${url}.pdf`,
      )
      res.header('Content-Type', 'application/pdf')
      res.header('Pragma', 'no-cache')
      res.header(
        'Cache-Control',
        'no-cache, no-store, max-age=0, must-revalidate',
      )
      return res.status(200).end(buffer)
    }
    return res.end()
  }

  @Post('/primary-school/:studentId/result/:assignmentResultId/pdf')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get a primary school assignment result PDF',
  })
  async getPrimarySchoolAssignmentResultPdf(
    @Param('studentId') studentId: string,
    @Param('assignmentResultId') assignmentResultId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    try {
      const blob = await this.primarySchoolService.getAssignmentResultPdf(
        user,
        studentId,
        assignmentResultId,
      )

      if (blob) {
        this.auditService.audit({
          action: 'getPrimarySchoolAssignmentResultPdf',
          auth: user,
          resources: `${studentId}/${assignmentResultId}`,
        })

        const contentArrayBuffer = await blob.arrayBuffer()
        const buffer = Buffer.from(contentArrayBuffer)

        res.header('Content-length', buffer.length.toString())
        res.header(
          'Content-Disposition',
          `attachment; filename="${user.nationalId}-namsmat-${assignmentResultId}.pdf"`,
        )
        res.header('Content-Type', 'application/pdf')
        res.header('Pragma', 'no-cache')
        res.header(
          'Cache-Control',
          'no-cache, no-store, max-age=0, must-revalidate',
        )
        return res.status(200).end(buffer)
      }
      return res.status(404).end()
    } catch (error) {
      this.logger.error('Failed to get primary school assignment result PDF', {
        errorMessage: error.message,
        errorStack: error.stack,
        assignmentResultId,
      })
      return res.status(500).end()
    }
  }
}
