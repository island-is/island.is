import { Inject, Injectable } from '@nestjs/common'
import { AppRepository } from './app.repository'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

@Injectable()
export class AppService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly repository: AppRepository,
  ) {}

  public async run() {
    this.logger.debug('Starting cms import worker...')
    const grants = await this.repository.createGrant([
      {
        field: 'grantName',
        value: {
          en: 'Bing',
          'is-IS': 'bang',
        },
      },
    ])

    this.logger.debug('grants', grants)
    this.logger.debug('Cms import worker done.')
  }
}
