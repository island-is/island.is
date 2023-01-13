import { StatsD, ClientOptions, Tags } from 'hot-shots'

export const METRICS_PROVIDER = 'Metrics'

export type DogStatsDTags = Tags

export class DogStatsD extends StatsD {
  constructor(options: ClientOptions = {}) {
    super({
      ...options,
      prefix: `islandis.${options.prefix}`.replace(':', '.'),
    })
  }

  static timer() {
    return process.hrtime.bigint()
  }

  static duration(start: bigint): number {
    const diff = process.hrtime.bigint() - start
    return Number(diff) / 1e6
  }
}
