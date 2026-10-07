import { Injectable } from '@nestjs/common'
import { data } from '@island.is/clients/middlewares'
import { getStatistics } from '../../gen/fetch'
import type { AggregateStatisticsDto } from '../../gen/fetch'

@Injectable()
export class DirectorateOfEqualityStatisticsClientService {
  private cached: AggregateStatisticsDto | null = null
  private pending: Promise<AggregateStatisticsDto> | null = null

  /**
   * The figures change once a day, so the result is kept until the API's own
   * `expiresAt`. Concurrent calls share one request; a failed request is not
   * cached, so the next call retries.
   */
  async getStatistics(): Promise<AggregateStatisticsDto> {
    if (this.cached && Date.now() < this.cached.expiresAt.getTime()) {
      return this.cached
    }

    if (!this.pending) {
      this.pending = data(getStatistics())
        .then((statistics) => {
          if (!statistics) {
            throw new Error('DoE statistics response had no body')
          }
          this.cached = statistics
          return statistics
        })
        .finally(() => {
          this.pending = null
        })
    }

    return this.pending
  }
}
