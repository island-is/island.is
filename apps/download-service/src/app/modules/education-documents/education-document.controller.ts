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
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
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
import { LOGGER_PROVIDER, type Logger, withLoggingContext } from '@island.is/logging'
import { unmaskString } from '@island.is/shared/utils'
import { PrimarySchoolAssignmentResultParamsDto } from './dto/primarySchoolAssignmentResultParams.dto'

type PrimarySchoolImplementation = 'old' | 'current' | 'new'

// Realistic error shapes we actually see from MMS/X-Road, for the
// simulate-failure feature flag (Features.downloadServiceSimulateMmsPrimarySchoolFailure).
const SIMULATED_FAILURE_SCENARIOS = [
  {
    name: 'timeout',
    make: () =>
      Object.assign(new Error('network timeout at: http://mms-test/pdf'), {
        name: 'FetchError',
        type: 'request-timeout',
      }),
  },
  {
    name: 'bad-gateway-500',
    make: () =>
      Object.assign(new Error('Internal Server Error'), {
        name: 'FetchError',
        status: 500,
      }),
  },
  {
    name: 'bad-gateway-502',
    make: () =>
      Object.assign(new Error('Bad Gateway'), {
        name: 'FetchError',
        status: 502,
      }),
  },
  {
    name: 'service-unavailable-503',
    make: () =>
      Object.assign(new Error('Service Unavailable'), {
        name: 'FetchError',
        status: 503,
      }),
  },
  {
    name: 'bad-request-400',
    make: () =>
      Object.assign(new Error('Bad Request'), {
        name: 'FetchError',
        status: 400,
      }),
  },
  {
    name: 'network-error',
    make: () =>
      Object.assign(new Error('request to http://mms-test/pdf failed, reason: ECONNRESET'), {
        name: 'FetchError',
        type: 'system',
      }),
  },
] as const

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.education)
@Controller('education')
export class EducationController {
  constructor(
    private readonly universitiesApi: UniversityCareersClientService,
    private readonly primarySchoolService: PrimarySchoolClientService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
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
  async getPrimarySchoolAssignmentResultPdf(
    @Param() params: PrimarySchoolAssignmentResultParamsDto,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { studentId, assignmentResultId } = params

    const implementation = await this.featureFlagService.getValue<
      PrimarySchoolImplementation
    >(Features.downloadServiceMmsPrimarySchoolImplementationTest, 'current', user)

    if (implementation === 'old') {
      return this.getPrimarySchoolAssignmentResultPdfOld(
        studentId,
        assignmentResultId,
        user,
        res,
      )
    }
    if (implementation === 'new') {
      return this.getPrimarySchoolAssignmentResultPdfNew(
        studentId,
        assignmentResultId,
        user,
      )
    }
    return this.getPrimarySchoolAssignmentResultPdfCurrent(
      studentId,
      assignmentResultId,
      user,
      res,
    )
  }

  // TEMPORARY — pre-#22820 behavior, kept only for side-by-side comparison via
  // Features.downloadServiceMmsPrimarySchoolImplementationTest. Delete once 'new'
  // is trusted.
  private async getPrimarySchoolAssignmentResultPdfOld(
    studentId: string,
    assignmentResultId: string,
    user: User,
    res: Response,
  ) {
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
      res.status(200).end(buffer)
      return
    }
    res.status(404).end()
  }

  // TEMPORARY — today's real merged behavior (#22820's manual patch), kept
  // only for side-by-side comparison via
  // Features.downloadServiceMmsPrimarySchoolImplementationTest. Delete once 'new'
  // is trusted.
  private async getPrimarySchoolAssignmentResultPdfCurrent(
    studentId: string,
    assignmentResultId: string,
    user: User,
    res: Response,
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
        res.status(200).end(buffer)
        return
      }
      res.status(404).end()
    } catch (error) {
      this.logger.error('Failed to get primary school assignment result PDF', {
        errorMessage: error.message,
        errorStack: error.stack,
        assignmentResultId,
      })
      res.status(500).end()
    }
  }

  // Target implementation. No manual catch/logging around the client call —
  // ProblemModule's ErrorFilter/HttpExceptionFilter handle logging (via the
  // app's real structured logger) and response shaping. withLoggingContext
  // tags every log line made within this scope — both the client's own
  // withErrorLog call and ProblemModule's eventual log — with studentId and
  // assignmentResultId, without mutating the error or adding a new log call.
  private async getPrimarySchoolAssignmentResultPdfNew(
    studentId: string,
    assignmentResultId: string,
    user: User,
  ) {
    return withLoggingContext({ studentId, assignmentResultId }, async () => {
      const simulateFailure = await this.featureFlagService.getValue(
        Features.downloadServiceSimulateMmsPrimarySchoolFailure,
        false,
        user,
      )

      if (simulateFailure) {
        const scenario =
          SIMULATED_FAILURE_SCENARIOS[
            Math.floor(Math.random() * SIMULATED_FAILURE_SCENARIOS.length)
          ]
        this.logger.info('Simulating MMS primary-school PDF failure', {
          scenario: scenario.name,
        })
        throw scenario.make()
      }

      // No catch here — a client failure propagates as-is to ProblemModule's
      // ErrorFilter, which logs it (via the real structured logger) and
      // returns a problem+json 500. Same stack trace, no new exception.
      const blob = await this.primarySchoolService.getAssignmentResultPdf(
        user,
        studentId,
        assignmentResultId,
      )

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
