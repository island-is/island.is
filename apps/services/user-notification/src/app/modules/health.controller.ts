import { InfraController } from '@island.is/infra-nest-server'
import { Controller, Get } from '@nestjs/common'
// import { ApiOkResponse } from '@nestjs/swagger'
// import { Readiness } from './dto/readinessDto'
// import dns from 'dns'

@Controller()
export class NotificationsInfraController extends InfraController {
  constructor() {
    super()
  }

  @Get('readiness')
//   @ApiOkResponse({ type: {ok:boolean} }) // TODO HOOOK THIS UP
  async readiness(): Promise<{ok:boolean}> {
    const result = true
    return { ok: result }
  }
}
