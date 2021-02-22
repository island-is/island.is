import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Environment } from '@island.is/api-catalogue/consts'
import { logger } from '@island.is/logging'

export interface CollectorConfig {
  environment: Environment
  aliasName: string
  elasticNode: string
  production: boolean
}

@Injectable()
export class CollectionConfigService {
  private environment: Environment
  private aliasName: string
  private elasticNode: string
  private production: boolean

  constructor(private configService: ConfigService) {
    this.init()
  }

  private init() {
    const config = this.loadConfig()
    this.environment = config.environment
    this.aliasName = config.aliasName
    this.elasticNode = config.elasticNode
    this.production = config.production
  }

  private loadConfig(): CollectorConfig {
    logger.debug('Checking config')
    const environmentStr = this.configService.get<string>('environment')
    logger.warn(JSON.stringify(environmentStr, null, 4))
    if (!environmentStr) {
      throw new Error('Environment variable ENVIRONMENT is missing')
    }
    const aliasName = this.configService.get<string>('aliasName')
    if (!aliasName) {
      throw new Error('Environment variable XROAD_COLLECTOR_ALIAS is missing')
    }
    const elasticNode = this.configService.get<string>('elasticNode')
    if (!elasticNode) {
      throw new Error('Environment variable ELASTIC_NODE is missing')
    }
    const production = this.configService.get<boolean>('production')
    if (production !== true && production !== false) {
      throw new Error('boolean value production not set')
    }

    const environment: Environment =
      Environment[
        Object.keys(Environment).find(
          (key) => Environment[key] === environmentStr,
        )
      ]

    if (!environment) {
      throw new Error(
        `Invalid value in environment variable "ENVIRONMENT". Valid values:[${Environment.DEV}|${Environment.STAGING}|${Environment.PROD}]`,
      )
    }

    const ret: CollectorConfig = {
      environment: environment,
      aliasName: aliasName,
      elasticNode: elasticNode,
      production: production,
    }

    logger.info('Config values:', ret)
    return ret
  }
  getConfig(): CollectorConfig {
    return {
      environment: this.environment,
      aliasName: this.aliasName,
      elasticNode: this.elasticNode,
      production: this.production,
    }
  }
}
