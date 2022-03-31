import { Injectable } from '@nestjs/common'

import { logger } from '@island.is/logging'

@Injectable()
export class AppService {
  async run() {
    logger.info('Starting scheduler')

    // Do someting

    logger.info('Scheduler done')
  }
}
