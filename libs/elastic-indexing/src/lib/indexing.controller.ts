import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common'
import { IndexingService } from './indexing.service'
import { logger } from '@island.is/logging'
import { environment } from '../environments/environment'
import { SyncInput } from './dto/syncInput.input'

@Controller('')
export class IndexingController {
  constructor(private readonly indexingService: IndexingService) {}

  @Get('/')
  async hello() {
    return {
      ready: true,
    }
  }

  @Get('ping')
  async ping() {
    return this.indexingService.ping()
  }

  @Get('sync')
  async sync(@Query() { locale = 'is', token = '' }: SyncInput) {
    if (environment.syncToken !== token) {
      logger.warn('Failed to validate sync access token', {
        receivedToken: token,
      })
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }

    // ToDo: implement rank evaluation for english
    const rankEvaluation = await this.indexingService.rankEvaluation('is')

    //
    // eslint-disable-next-line @typescript-eslint/camelcase
    logger.info('Rank evaluation, metric score: ', {
      locale,
      // eslint-disable-next-line @typescript-eslint/camelcase
      metric_score: rankEvaluation.body?.metric_score ?? null,
    })

    logger.info('Doing sync')
    await this.indexingService.doSync({ fullSync: false, locale })
    return {
      acknowledge: true,
    }
  }

  @Get('re-sync')
  async resync(@Query() { locale = 'is', token = '' }: SyncInput) {
    if (environment.syncToken !== token) {
      logger.warn('Failed to validate sync access token', {
        receivedToken: token,
      })
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }

    logger.info('Doing re-sync')
    await this.indexingService.doSync({ fullSync: true, locale })
    return {
      acknowledge: true,
    }
  }

  @Get('rank-evaluation')
  async rankEvaluation(@Query() { locale = 'is', token = '' }: SyncInput) {
    if (environment.syncToken !== token) {
      logger.warn('Failed to validate sync access token', {
        receivedToken: token,
      })
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }

    return this.indexingService.rankEvaluation(locale)
  }
}
