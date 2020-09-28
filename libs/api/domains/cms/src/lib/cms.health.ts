import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError, DNSHealthIndicator, HealthCheckService, HealthCheckResult } from '@nestjs/terminus';
import dns from 'dns';
import { logger } from '@island.is/logging';

@Injectable()
export class CmsHealthIndicator extends HealthIndicator {
  constructor(private dns: DNSHealthIndicator, private health: HealthCheckService) { super() }

  canUrlBeResolved(key: string, url: string): Promise<HealthIndicatorResult> {
    return new Promise((resolve, reject) => {
      logger.info('key', { key })
      logger.info('url', { url })
      dns.lookup(url, (err) => {
        if (err) throw new HealthCheckError('Cms failed to resolve url', this.getStatus('cms', false))
        resolve(this.getStatus(key, true))
      })
    })
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    // we run this in the cluster, we only need the healthchecks to pass there
    // so we listen to the raw environment variables
    const requiredUrls = {
      'contentful': process.env.CONTENTFUL_HOST,
      'elasticsearch': new URL(process.env.ELASTIC_NODE).hostname,
      'tetser': 'asdfasdasdafsdfs.com'
    }

    let healthResponse: HealthCheckResult
    try {
      healthResponse = await this.health.check(
        Object.entries(requiredUrls).map(([key, url]) => () => this.canUrlBeResolved(key, url))
      )
    } catch (error) {
      healthResponse = { status: 'error', details: {} }
    }

    const isHealthy = healthResponse.status === 'ok'
    const result = this.getStatus('cms', isHealthy, healthResponse)

    if (isHealthy) {
      return result
    } else {
      throw new HealthCheckError('Cms check failed', result)
    }
  }
}
