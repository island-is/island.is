import { StatsD, ClientOptions } from 'hot-shots'

export const dogStatsD = (options: ClientOptions) => {
  return new StatsD({
    ...options,
    prefix: `islandis.${options.prefix}`,
  })
}
