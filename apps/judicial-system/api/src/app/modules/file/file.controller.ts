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

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { JwtInjectBearerAuthGuard } from '@island.is/judicial-system/auth'

import { environment } from '../../../environments'

@UseGuards(JwtInjectBearerAuthGuard)
@Controller('api')
export class FileController {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Get('case/:id/ruling')
  @Header('Content-Type', 'application/pdf')
  async getRulingPdf(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.logger.debug(`Getting the ruling for case ${id} as a pdf document`)

    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('authorization', req.headers.authorization as string)
    headers.set('cookie', req.headers.cookie as string)

    const result = await fetch(
      `${environment.backendUrl}/api/case/${id}/ruling`,
      { headers },
    )

    if (!result.ok) {
      return res.status(result.status).json(result.statusText)
    }

    const stream = result.body

    res.header('Content-length', result.headers.get('Content-Length') as string)

    return stream.pipe(res)
  }
}
