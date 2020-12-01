import fetch from 'node-fetch'
import { Response } from 'express'

import {
  Controller,
  Get,
  Header,
  Inject,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../../environments'
import { JwtAuthGuard } from '../auth'

@UseGuards(JwtAuthGuard)
@Controller('api')
export class FileController {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Get('case/:id/ruling')
  @Header('Content-Type', 'application/pdf')
  async getRulingPdf(@Param('id') id: string, @Res() res: Response) {
    this.logger.debug(`Getting the ruling for case ${id} as a pdf document`)

    const result = await fetch(
      `${environment.backendUrl}/api/case/${id}/ruling`,
      {
        headers: { 'Content-Type': 'application/pdf' },
      },
    )

    const stream = result.body

    res.header('Content-length', result.headers.get('Content-Length') as string)

    return stream.pipe(res)
  }
}
