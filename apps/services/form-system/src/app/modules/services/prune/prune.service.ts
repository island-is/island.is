import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class PruneService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    this.logger = logger.child({ context: 'PruneService' })
  }

  public async run() {
    this.logger.info(`Starting application pruning...`)
    await this.fetchApplicationsToBePruned()
    this.logger.info(`Application pruning done.`)
  }
  private async fetchApplicationsToBePruned() {
    console.log('inside fetch applisations to be pruned')
  }
}
