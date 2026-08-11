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
import { ConfigType } from '@nestjs/config'
import {
  Controller,
  Header,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { Response } from 'express'
import {
  LOGGER_PROVIDER,
  type Logger,
  withLoggingContext,
} from '@island.is/logging'
import { unmaskString } from '@island.is/shared/utils'
import { PrimarySchoolAssignmentResultParamsDto } from './dto/primarySchoolAssignmentResultParams.dto'
import { EducationDocumentsConfig } from './education-document.config'
import { acceptableTimeSignal } from '../../utils/acceptableTime'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.education)
@Controller('education')
export class EducationController {
  constructor(
    private readonly universitiesApi: UniversityCareersClientService,
    private readonly primarySchoolService: PrimarySchoolClientService,
    private readonly auditService: AuditService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(EducationDocumentsConfig.KEY)
    private readonly educationDocumentsConfig: ConfigType<
      typeof EducationDocumentsConfig
    >,
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
        `attachment; filename="${user.nationalId}-skoli-${UniversityShortIdMap[uni]}-${url}.pdf"`,
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
  @HttpCode(200)
  @Header('X-Content-Type-Options', 'nosniff')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Get a primary school assignment result PDF',
  })
  // No manual catch/logging around the client call — ProblemModule's
  // ErrorFilter/HttpExceptionFilter handle logging (via the app's real
  // structured logger) and response shaping. withLoggingContext tags every
  // log line made within this scope — both the client's own withErrorLog
  // call and ProblemModule's eventual log — with studentId and
  // assignmentResultId, without mutating the error or adding a new log call.
  async getPrimarySchoolAssignmentResultPdf(
    @Param() params: PrimarySchoolAssignmentResultParamsDto,
    @CurrentUser() user: User,
  ) {
    const { studentId, assignmentResultId } = params

    this.logger.info('Serving primary school assignment result PDF request', {
      studentId,
      assignmentResultId,
    })

    return withLoggingContext({ studentId, assignmentResultId }, async () => {
      const timeoutMs = this.educationDocumentsConfig.primarySchoolPdfTimeoutMs
      const signal = acceptableTimeSignal(timeoutMs)

      let blob: Blob | File | null
      try {
        blob = await this.primarySchoolService.getAssignmentResultPdf(
          user,
          studentId,
          assignmentResultId,
          signal,
        )
      } catch (error) {
        // node-fetch always throws its own hardcoded AbortError regardless of
        // the signal's reason, so without a rethrow the eventual ProblemModule
        // log would just say "the user aborted a request," with no indication
        // of why or after how long.
        if (error instanceof Error && error.name === 'AbortError') {
          throw Object.assign(
            new Error(
              `download-service timeout exceeded (over ${timeoutMs}ms)`,
            ),
            { name: 'TimeoutExceededError' },
          )
        }
        throw error
      }

      if (!blob) {
        throw new NotFoundException(
          'Primary school assignment result PDF not found',
        )
      }

      this.auditService.audit({
        action: 'getPrimarySchoolAssignmentResultPdf',
        auth: user,
        resources: `${studentId}/${assignmentResultId}`,
      })

      const buffer = Buffer.from(await blob.arrayBuffer())
      return new StreamableFile(buffer, {
        type: 'application/pdf',
        disposition: `attachment; filename="namsmat-${assignmentResultId}.pdf"`,
        length: buffer.length,
      })
    })
  }
}
