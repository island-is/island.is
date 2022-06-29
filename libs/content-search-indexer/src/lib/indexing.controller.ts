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
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

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
        recivedToken: token,
      })
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }

    const syncStatus = await this.indexingService.getSyncStatus(locale)
    if (syncStatus?.running) {
      logger.info('Sync is already running, request ignored')
      return {
        acknowledge: true,
      }
    }

    logger.info('Doing sync')
    await this.indexingService.updateSyncStatus(locale, {
      running: true,
      lastStart: new Date().getTime().toString(),
    })
    await this.indexingService.doSync({ syncType: 'fromLast', locale })
    await this.indexingService.updateSyncStatus(locale, {
      running: false,
      lastFinish: new Date().getTime().toString(),
    })

    return {
      acknowledge: true,
    }
  }

  @Get('re-sync')
  async resync(@Query() { locale = 'is', token = '' }: SyncInput) {
    if (environment.syncToken !== token) {
      logger.warn('Failed to validate sync access token', {
        recivedToken: token,
      })
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }

    logger.info('Doing re-sync')
    await this.indexingService.doSync({ syncType: 'full', locale })
    return {
      acknowledge: true,
    }
  }

  @Get('status')
  async status(@Query() { locale = 'is', token = '' }: SyncInput) {
    if (environment.syncToken !== token) {
      logger.warn('Failed to validate sync access token', {
        recivedToken: token,
      })
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }

    return this.indexingService.getSyncStatus(locale)
  }

  @Get('document')
  async document(
    @Query() { locale = 'is' as ElasticsearchIndexLocale, token = '', id = '' },
  ) {
    if (environment.syncToken !== token) {
      logger.warn('Failed to validate sync access token', {
        recivedToken: token,
      })
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }

    try {
      return this.indexingService.getDocumentById(locale, id)
    } catch (error) {
      return { error: true }
    }
  }
}
