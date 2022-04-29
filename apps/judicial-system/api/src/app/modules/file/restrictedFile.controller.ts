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

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  CurrentHttpUser,
  JwtInjectBearerAuthGuard,
} from '@island.is/judicial-system/auth'
import { AuditedAction } from '@island.is/judicial-system/audit-trail'
import type { User } from '@island.is/judicial-system/types'

import { FileService } from './file.service'

@UseGuards(new JwtInjectBearerAuthGuard(true))
@Controller('api/case/:id')
export class RestrictedFileController {
  constructor(
    private readonly fileService: FileService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Get('request/restricted')
  @Header('Content-Type', 'application/pdf')
  async getRequestPdf(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.debug(`Getting the request for case ${id} as a pdf document`)

    return this.fileService.tryGetPdf(
      user.id,
      AuditedAction.GET_REQUEST_PDF,
      id,
      'request/restricted',
      req,
      res,
    )
  }

  @Get('courtRecord/restricted')
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

    return this.fileService.tryGetPdf(
      user.id,
      AuditedAction.GET_COURT_RECORD,
      id,
      'courtRecord/restricted',
      req,
      res,
    )
  }

  @Get('ruling/restricted')
  @Header('Content-Type', 'application/pdf')
  async getRulingPdf(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.debug(`Getting the ruling for case ${id} as a pdf document`)

    return this.fileService.tryGetPdf(
      user.id,
      AuditedAction.GET_RULING_PDF,
      id,
      'ruling/restricted',
      req,
      res,
    )
  }
}
