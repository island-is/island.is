import StatsDClient, { ClientOptions, StatsD } from 'hot-shots'
import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { MetricsOptions, METRICS_OPTIONS } from './metrics.options'

type ProtocolType = ClientOptions['protocol']

/** Type safe cast of env string into legal protocol */
function parseProtocol(str?: string): ProtocolType {
  if (!str) {
    return undefined
  }

  const values: Record<Exclude<ProtocolType, undefined>, 1> = {
    tcp: 1,
    udp: 1,
    uds: 1,
    stream: 1,
  }

  return str in values ? (str as ProtocolType) : undefined
}

@Injectable()
export class MetricsService {
  private stats?: StatsD

  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(METRICS_OPTIONS)
    private options: MetricsOptions,
  ) {
    const parsedPort = parseInt(options.port, 10) || undefined

    this.stats = new StatsDClient({
      path: options.path,
      port: parsedPort,
      protocol: parseProtocol(options.protocol),
      prefix: options.prefix,
      errorHandler: this.errorHandler,
    })
  }

  private errorHandler(error: Error) {
    this.logger.error(`Error from metrics service`, error)
  }

  increment(counter: string) {
    this.stats?.increment(counter)
  }
}
