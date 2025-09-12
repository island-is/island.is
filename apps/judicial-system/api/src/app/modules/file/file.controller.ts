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

import { FileService } from './file.service'

@UseGuards(JwtInjectBearerAuthGuard)
@Controller('api/case/:id')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Get('request')
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

  @Get([
    'caseFilesRecord/:policeCaseNumber',
    'mergedCase/:mergedCaseId/caseFilesRecord/:policeCaseNumber',
  ])
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

  @Get('courtRecord')
  @Header('Content-Type', 'application/pdf')
  getCourtRecordPdf(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.debug(
      `Getting the court record for case ${id} as a pdf document`,
    )

    return this.fileService.tryGetFile(
      user.id,
      AuditedAction.GET_COURT_RECORD,
      id,
      'courtRecord',
      req,
      res,
      'pdf',
    )
  }

  @Get('ruling')
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

  @Get('custodyNotice')
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

  @Get([
    'indictment',
    'indictment/:fileName',
    'mergedCase/:mergedCaseId/indictment',
    'mergedCase/:mergedCaseId/indictment/:fileName',
  ])
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

  @Get([
    'subpoena/:defendantId',
    'subpoena/:defendantId/:fileName',
    'subpoena/:defendantId/:subpoenaId',
    'subpoena/:defendantId/:subpoenaId/:fileName',
  ])
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

  @Get('subpoenaServiceCertificate/:defendantId/:subpoenaId')
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

  @Get('verdictServiceCertificate/:defendantId')
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

  @Get(['rulingSentToPrisonAdmin', 'rulingSentToPrisonAdmin/:fileName'])
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
