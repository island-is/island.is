import fetch, { Headers } from 'node-fetch'
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
import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import type { User } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import { FileExeption } from './file.exception'

@UseGuards(JwtInjectBearerAuthGuard)
@Controller('api/case/:id')
export class FileController {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async getPdf(
    id: string,
    route: string,
    req: Request,
    res: Response,
  ): Promise<Response> {
    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('authorization', req.headers.authorization as string)
    headers.set('cookie', req.headers.cookie as string)

    const result = await fetch(
      `${environment.backend.url}/api/case/${id}/${route}`,
      { headers },
    )

    if (!result.ok) {
      throw new FileExeption(result.status, result.statusText)
    }

    const stream = result.body

    res.header('Content-length', result.headers.get('Content-Length') as string)

    return stream.pipe(res)
  }

  private async tryGetPdf(
    userId: string,
    auditAction: AuditedAction,
    id: string,
    route: string,
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      return this.auditTrailService.audit(
        userId,
        auditAction,
        this.getPdf(id, route, req, res),
        id,
      )
    } catch (error) {
      if (error instanceof FileExeption) {
        return res.status(error.status).json(error.message)
      }

      throw error
    }
  }

  @Get('request')
  @Header('Content-Type', 'application/pdf')
  async getRequestPdf(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.debug(`Getting the request for case ${id} as a pdf document`)

    return this.tryGetPdf(
      user.id,
      AuditedAction.GET_REQUEST_PDF,
      id,
      'request',
      req,
      res,
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

    return this.tryGetPdf(
      user.id,
      AuditedAction.GET_COURT_RECORD,
      id,
      'courtRecord',
      req,
      res,
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

    return this.tryGetPdf(
      user.id,
      AuditedAction.GET_RULING_PDF,
      id,
      'ruling',
      req,
      res,
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
    this.logger.debug(`Getting the ruling for case ${id} as a pdf document`)

    return this.tryGetPdf(
      user.id,
      AuditedAction.GET_CUSTODY_NOTICE_PDF,
      id,
      'custodyNotice',
      req,
      res,
    )
  }
}
