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
<<<<<<< HEAD
//   @ApiOkResponse({ type: {ok:boolean} }) // TODO HOOOK THIS UP
  async readiness(): Promise<{ok:boolean}> {
=======
  //   @ApiOkResponse({ type: {ok:boolean} })
  async readiness(): Promise<{ ok: boolean }> {
>>>>>>> cb424c68cc56d894ebaa4dcb7156b8d280166fb3
    const result = true
    return { ok: result }
  }
}
