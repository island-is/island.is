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
    pdfDoc: string,
    req: Request,
    res: Response,
  ): Promise<Response> {
    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('authorization', req.headers.authorization as string)
    headers.set('cookie', req.headers.cookie as string)

    const result = await fetch(
      `${environment.backend.url}/api/case/${id}/${pdfDoc}`,
      { headers },
    )

    if (!result.ok) {
      throw new FileExeption(result.status, result.statusText)
    }

    const stream = result.body

    res.header('Content-length', result.headers.get('Content-Length') as string)

    return stream.pipe(res)
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

    try {
      return this.auditTrailService.audit(
        user.id,
        AuditedAction.GET_REQUEST_PDF,
        this.getPdf(id, 'request', req, res),
        id,
      )
    } catch (error) {
      this.logger.debug(
        `Failed to get the request for case ${id} as a pdf document`,
        error,
      )

      if (error instanceof FileExeption) {
        return res.status(error.status).json(error.message)
      }

      throw error
    }
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

    try {
      return this.auditTrailService.audit(
        user.id,
        AuditedAction.GET_RULING_PDF,
        this.getPdf(id, 'ruling', req, res),
        id,
      )
    } catch (error) {
      this.logger.debug(
        `Failed to get the ruling for case ${id} as a pdf document`,
        error,
      )

      if (error instanceof FileExeption) {
        return res.status(error.status).json(error.message)
      }

      throw error
    }
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

    try {
      return this.auditTrailService.audit(
        user.id,
        AuditedAction.GET_RULING_PDF,
        this.getPdf(id, 'custodyNotice', req, res),
        id,
      )
    } catch (error) {
      this.logger.debug(
        `Failed to get the custody notice for case ${id} as a pdf document`,
        error,
      )

      if (error instanceof FileExeption) {
        return res.status(error.status).json(error.message)
      }

      throw error
    }
  }
}
