import { InfraController } from '@island.is/infra-nest-server'
import { BadRequestException, Controller, Get } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { environment } from '../../../environments'
import { Readiness } from './dto/readinessDto'
import dns from 'dns'

@Controller()
export class DocumentsInfraController extends InfraController {
  constructor() {
    super()
  }

  @Get('readiness')
  @ApiOkResponse({ type: Readiness })
  async readiness(): Promise<Readiness> {
    const url = `${environment.documentService.basePath}`.replace(
      'https://',
      '',
    )

    const result = await new Promise<boolean>((resolve, reject) => {
      dns.lookup(url, (err) => {
        if (err) reject(false)
        resolve(true)
      })
    })
    if (!result) throw new BadRequestException()
    return { ok: result }
  }
}
