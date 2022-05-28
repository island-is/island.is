import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Entry } from './types'
import { AppRepository } from './app.repository'

@Injectable()
export class AppService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly appRepository: AppRepository,
  ) {}

  async handleEntryCreation(entry: Entry) {
    try {
      this.appRepository.tagEntry(entry)
    } catch (error) {
      throw new HttpException(
        'Error occured when handling request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
