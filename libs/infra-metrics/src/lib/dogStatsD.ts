import { StatsD, ClientOptions } from 'hot-shots'

export class DogStatsD extends StatsD {
  constructor(options: ClientOptions = {}) {
    super({
      ...options,
      prefix: `islandis.${options.prefix}`.replace(':', '.'),
    })
  }
}
