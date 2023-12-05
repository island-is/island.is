// import { InfraController } from '@island.is/infra-nest-server'
// import { Controller, Get } from '@nestjs/common'
// // import { ApiOkResponse } from '@nestjs/swagger'
// // import { Readiness } from './dto/readinessDto'
// // import dns from 'dns'

// @Controller()
// export class NotificationsInfraController extends InfraController {
//   constructor() {
//     super()
//   }

//   @Get('/readiness')
//   //   @ApiOkResponse({ type: {ok:boolean} }) // TODO HOOOK THIS UP
//   async readiness(): Promise<{ ok: boolean }> {
//     const result = true
//     return { ok: result }
//   }
// }

import { LOGGER_PROVIDER } from '@island.is/logging';
import { Controller, Get, Res, HttpStatus, Version, VERSION_NEUTRAL, Inject, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Sequelize } from 'sequelize-typescript';

@Controller('')
export class HealthController {
  constructor(
    private sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    ) {}

  @Get('/readiness')
  @Version(VERSION_NEUTRAL)
  @ApiTags('internal')
  async checkReadiness(@Res() response: any) {
    try {
      await this.sequelize.authenticate();
      // return response.status(HttpStatus.OK).json({ status: 'ok' });
      return {ok:true}
    } catch (error) {
      // return response.status(HttpStatus.SERVICE_UNAVAILABLE).json({ status: 'error', message: error.message });
      this.logger.error(error);
      return {ok:false}
    }
  }
}
