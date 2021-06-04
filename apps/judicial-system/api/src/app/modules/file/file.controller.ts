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

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
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

@UseGuards(JwtInjectBearerAuthGuard)
@Controller('api/case/:id')
export class FileController {
  constructor(
    private readonly auditTrailService: AuditTrailService,
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
  ) {
    this.logger.debug(`Getting the request for case ${id} as a pdf document`)

    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('authorization', req.headers.authorization as string)
    headers.set('cookie', req.headers.cookie as string)

    const result = await fetch(
      `${environment.backend.url}/api/case/${id}/request`,
      { headers },
    )

    if (!result.ok) {
      return res.status(result.status).json(result.statusText)
    }

    const stream = result.body

    res.header('Content-length', result.headers.get('Content-Length') as string)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_REQUEST_PDF,
      stream.pipe(res),
      id,
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

    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('authorization', req.headers.authorization as string)
    headers.set('cookie', req.headers.cookie as string)

    const result = await fetch(
      `${environment.backend.url}/api/case/${id}/ruling`,
      { headers },
    )

    if (!result.ok) {
      return res.status(result.status).json(result.statusText)
    }

    const stream = result.body

    res.header('Content-length', result.headers.get('Content-Length') as string)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_RULING_PDF,
      stream.pipe(res),
      id,
    )
  }
}
