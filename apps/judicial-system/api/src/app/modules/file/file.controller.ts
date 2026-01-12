import { Request, Response } from 'express'

import {
  Controller,
  Get,
  Header,
  Inject,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { AuditedAction } from '@island.is/judicial-system/audit-trail'
import {
  CurrentHttpUser,
  JwtInjectBearerAuthGuard,
} from '@island.is/judicial-system/auth'
import { SubpoenaType, type User } from '@island.is/judicial-system/types'

import {
  CASE_FILES_RECORD_ENDPOINTS,
  COURT_RECORD_ENDPOINTS,
  CUSTODY_NOTICE_ENDPOINTS,
  INDICTMENT_ENDPOINTS,
  REQUEST_ENDPOINTS,
  RULING_ENDPOINTS,
  RULING_SENT_TO_PRISON_ADMIN_ENDPOINTS,
  SUBPOENA_ENDPOINTS,
  SUBPOENA_SERVICE_CERTIFICATE_ENDPOINTS,
  VERDICT_SERVICE_CERTIFICATE_ENDPOINTS,
} from './file.constants'
import { FileService } from './file.service'

@UseGuards(JwtInjectBearerAuthGuard)
@Controller('api/case/:id')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Get(REQUEST_ENDPOINTS)
  @Header('Content-Type', 'application/pdf')
  getRequestPdf(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.debug(`Getting the request for case ${id} as a pdf document`)

    return this.fileService.tryGetFile(
      user.id,
      AuditedAction.GET_REQUEST_PDF,
      id,
      'request',
      req,
      res,
      'pdf',
    )
  }

  @Get(CASE_FILES_RECORD_ENDPOINTS)
  @Header('Content-Type', 'application/pdf')
  getCaseFilesRecordPdf(
    @Param('id') id: string,
    @Param('mergedCaseId') mergedCaseId: string,
    @Param('policeCaseNumber') policeCaseNumber: string,
    @CurrentHttpUser() user: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.debug(`Getting the case files for case ${id} as a pdf document`)

    const mergedCaseInjection = mergedCaseId
      ? `mergedCase/${mergedCaseId}/`
      : ''

    return this.fileService.tryGetFile(
      user.id,
      AuditedAction.GET_CASE_FILES_PDF,
      id,
      `${mergedCaseInjection}caseFilesRecord/${policeCaseNumber}`,
      req,
      res,
      'pdf',
    )
  }

  @Get(COURT_RECORD_ENDPOINTS)
  @Header('Content-Type', 'application/pdf')
  getCourtRecordPdf(
    @Param('id') id: string,
    @Param('mergedCaseId') mergedCaseId: string,
    @CurrentHttpUser() user: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.debug(
      `Getting the court record for case ${id} as a pdf document`,
    )

    const mergedCaseInjection = mergedCaseId
      ? `mergedCase/${mergedCaseId}/`
      : ''

    return this.fileService.tryGetFile(
      user.id,
      AuditedAction.GET_COURT_RECORD,
      id,
      `${mergedCaseInjection}courtRecord`,
      req,
      res,
      'pdf',
    )
  }

  @Get(RULING_ENDPOINTS)
  @Header('Content-Type', 'application/pdf')
  getRulingPdf(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.debug(`Getting the ruling for case ${id} as a pdf document`)

    return this.fileService.tryGetFile(
      user.id,
      AuditedAction.GET_RULING_PDF,
      id,
      'ruling',
      req,
      res,
      'pdf',
    )
  }

  @Get(CUSTODY_NOTICE_ENDPOINTS)
  @Header('Content-Type', 'application/pdf')
  getCustodyNoticePdf(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.debug(
      `Getting the custody notice for case ${id} as a pdf document`,
    )

    return this.fileService.tryGetFile(
      user.id,
      AuditedAction.GET_CUSTODY_NOTICE_PDF,
      id,
      'custodyNotice',
      req,
      res,
      'pdf',
    )
  }

  @Get(INDICTMENT_ENDPOINTS)
  @Header('Content-Type', 'application/pdf')
  getIndictmentPdf(
    @Param('id') id: string,
    @Param('mergedCaseId') mergedCaseId: string,
    @CurrentHttpUser() user: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.debug(`Getting the indictment for case ${id} as a pdf document`)

    const mergedCaseInjection = mergedCaseId
      ? `mergedCase/${mergedCaseId}/`
      : ''

    return this.fileService.tryGetFile(
      user.id,
      AuditedAction.GET_INDICTMENT_PDF,
      id,
      `${mergedCaseInjection}indictment`,
      req,
      res,
      'pdf',
    )
  }

  @Get(SUBPOENA_ENDPOINTS)
  @Header('Content-Type', 'application/pdf')
  getSubpoenaPdf(
    @Param('id') id: string,
    @Param('defendantId') defendantId: string,
    @CurrentHttpUser() user: User,
    @Req() req: Request,
    @Res() res: Response,
    @Param('subpoenaId') subpoenaId?: string,
    @Query('arraignmentDate') arraignmentDate?: string,
    @Query('location') location?: string,
    @Query('subpoenaType') subpoenaType?: SubpoenaType,
  ): Promise<Response> {
    this.logger.debug(
      `Getting subpoena ${
        subpoenaId ?? 'draft'
      } for defendant ${defendantId} of case ${id} as a pdf document`,
    )

    const subpoenaIdInjection = subpoenaId ? `/${subpoenaId}/pdf` : ''
    const queryInjection = arraignmentDate
      ? `?arraignmentDate=${arraignmentDate}&location=${location}&subpoenaType=${subpoenaType}`
      : ''

    return this.fileService.tryGetFile(
      user.id,
      AuditedAction.GET_SUBPOENA_PDF,
      id,
      `defendant/${defendantId}/subpoena${subpoenaIdInjection}${queryInjection}`,
      req,
      res,
      'pdf',
    )
  }

  @Get(SUBPOENA_SERVICE_CERTIFICATE_ENDPOINTS)
  @Header('Content-Type', 'application/pdf')
  getSubpoenaServiceCertificatePdf(
    @Param('id') id: string,
    @Param('defendantId') defendantId: string,
    @Param('subpoenaId') subpoenaId: string,
    @CurrentHttpUser() user: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.debug(
      `Getting service certificate for subpoena ${subpoenaId} of defendant ${defendantId} and case ${id} as a pdf document`,
    )

    return this.fileService.tryGetFile(
      user.id,
      AuditedAction.GET_SUBPOENA_SERVICE_CERTIFICATE_PDF,
      id,
      `defendant/${defendantId}/subpoena/${subpoenaId}/serviceCertificate`,
      req,
      res,
      'pdf',
    )
  }

  @Get(VERDICT_SERVICE_CERTIFICATE_ENDPOINTS)
  @Header('Content-Type', 'application/pdf')
  getVerdictServiceCertificatePdf(
    @Param('id') id: string,
    @Param('defendantId') defendantId: string,
    @CurrentHttpUser() user: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.debug(
      `Getting service certificate for verdict of defendant ${defendantId} and case ${id} as a pdf document`,
    )

    return this.fileService.tryGetFile(
      user.id,
      AuditedAction.GET_VERDICT_SERVICE_CERTIFICATE_PDF,
      id,
      `defendant/${defendantId}/verdict/serviceCertificate`,
      req,
      res,
      'pdf',
    )
  }

  @Get(RULING_SENT_TO_PRISON_ADMIN_ENDPOINTS)
  @Header('Content-Type', 'application/pdf')
  getIndictmentRulingSentToPrisonAdminPdf(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.debug(
      `Getting the indictment ruling sent to prison admin for case ${id} as a pdf document`,
    )

    return this.fileService.tryGetFile(
      user.id,
      AuditedAction.GET_INDICTMENT_RULING_SENT_TO_PRISON_ADMIN_PDF,
      id,
      `rulingSentToPrisonAdmin`,
      req,
      res,
      'pdf',
    )
  }
}
