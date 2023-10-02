import { Injectable } from '@nestjs/common'
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
  HttpHealthIndicator,
  HealthCheckService,
} from '@nestjs/terminus'
import dns from 'dns'

import { environment } from './environments'

@Injectable()
export class CmsHealthIndicator extends HealthIndicator {
  constructor(
    private dns: HttpHealthIndicator,
    private health: HealthCheckService,
  ) {
    super()
  }

  /*
  we only check dns resolve to prevent cascading failures when a single service goes down
  a ping test here might cause such failures
  e.g. contentful starts to timeout our ping test gets 504 response and fails the readiness check and the whole api goes into standby and stops accepting traffic
  */
  canUrlBeResolved(key: string, url: string): Promise<HealthIndicatorResult> {
    return new Promise((resolve, reject) => {
      dns.lookup(url, (err) => {
        if (err)
          reject(
            new HealthCheckError(
              'Cms failed to resolve url',
              this.getStatus(key, false),
            ),
          )
        resolve(this.getStatus(key, true))
      })
    })
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const requiredUrls = {
      contentful: environment.contentful.host,
      elasticsearch: new URL(environment.elastic.node).hostname,
    }

    const response = await this.health.check(
      Object.entries(requiredUrls).map(
        ([key, url]) =>
          () =>
            this.canUrlBeResolved(key, url),
      ),
    )

    const isHealthy = response.status === 'ok'
    const result = this.getStatus('cms', isHealthy, response)

    if (isHealthy) {
      return result
    } else {
      throw new HealthCheckError('Cms check failed', result)
    }
  }
}
