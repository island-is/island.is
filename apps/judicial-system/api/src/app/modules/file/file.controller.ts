import { Request, Response } from 'express'

import {
  Controller,
  Get,
  Header,
  Inject,
  Param,
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
import type { User } from '@island.is/judicial-system/types'

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
  async getRequestPdf(
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

  @Get('caseFilesRecord/:policeCaseNumber')
  @Header('Content-Type', 'application/pdf')
  async getCaseFilesRecordPdf(
    @Param('id') id: string,
    @Param('policeCaseNumber') policeCaseNumber: string,
    @CurrentHttpUser() user: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.debug(`Getting the case files for case ${id} as a pdf document`)

    return this.fileService.tryGetFile(
      user.id,
      AuditedAction.GET_CASE_FILES_PDF,
      id,
      `caseFilesRecord/${policeCaseNumber}`,
      req,
      res,
      'pdf',
    )
  }

  @Get('courtRecord')
  @Header('Content-Type', 'application/pdf')
  async getCourtRecordPdf(
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
  async getRulingPdf(
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
  async getCustodyNoticePdf(
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

  @Get('indictment')
  @Header('Content-Type', 'application/pdf')
  async getIndictmentPdf(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.debug(`Getting the indictment for case ${id} as a pdf document`)

    return this.fileService.tryGetFile(
      user.id,
      AuditedAction.GET_INDICTMENT_PDF,
      id,
      'indictment',
      req,
      res,
      'pdf',
    )
  }
}
