import { DynamicModule } from '@nestjs/common'
import {
  CaseApi,
  ClientsApi,
  Configuration,
  DocumentApi,
  MemoApi,
  SecurityApi,
} from '../gen/fetch'

import { logger } from '@island.is/logging'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { TokenMiddleware } from './data-protection-complaint-client.middleware'
import { CLIENT_CONFIG, DataProtectionComplaintClientConfig } from './config'

export class ClientsDataProtectionComplaintModule {
  static register(config: DataProtectionComplaintClientConfig): DynamicModule {
    if (!config.xRoadBaseUrl) {
      logger.error('DataProtectionClient xRoadPath not provided.')
    }
    if (!config.password) {
      logger.error('DataProtectionClient password not provided.')
    }
    if (!config.username) {
      logger.error('DataProtectionClient username not provided.')
    }
    if (!config.xRoadClientId) {
      logger.error('DataProtectionClient xRoadClientId not provided.')
    }
    if (!config.XRoadProviderId) {
      logger.error('DataProtectionClient XRoadProviderId not provided.')
    }

    const basePath = `${config.xRoadBaseUrl}/r1/${config.XRoadProviderId}`
    const exportedApis = [
      DocumentApi,
      CaseApi,
      SecurityApi,
      MemoApi,
      ClientsApi,
    ]
    return {
      module: ClientsDataProtectionComplaintModule,
      providers: [
        {
          provide: CLIENT_CONFIG,
          useFactory: () => config,
        },
        {
          provide: SecurityApi,
          useFactory: () => {
            return new SecurityApi(
              new Configuration({
                fetchApi: createEnhancedFetch({
                  name: 'data-protection-complaint-client',
                  organizationSlug: 'personuvernd',
                  logErrorResponseBody: true,
                  timeout: 60 * 1000, // 60 sec
                }),
                basePath: basePath,
                headers: {
                  'X-Road-Client': config.xRoadClientId,
                  Accept: 'application/json',
                },
              }),
            )
          },
        },
        TokenMiddleware,
        ...exportedApis.map((Api) => ({
          provide: Api,
          useFactory: () => {
            return new Api(
              new Configuration({
                fetchApi: createEnhancedFetch({
                  name: 'data-protection-complaint-client',
                  logErrorResponseBody: true,
                  timeout: 60 * 1000, // 60 sec
                }),
                basePath: basePath,
                headers: {
                  'X-Road-Client': config.xRoadClientId,
                  Accept: 'application/json',
                },
              }),
            )
          },
        })),
      ],
      exports: [...exportedApis, TokenMiddleware],
    }
  }
}
