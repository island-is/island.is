import { DynamicModule, Module } from '@nestjs/common'
import {
  CLIENT_CONFIG,
  ComplaintToAlthingiOmbudsmanClientConfig,
} from './config/config'
import { logger } from '@island.is/logging'
import {
  CaseApi,
  ClientsApi,
  Configuration,
  DocumentApi,
  MemoApi,
  SecurityApi,
} from '../gen/fetch/dev'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { TokenMiddleware } from './clients-althingi-ombudsman.middleware'

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class ClientsAlthingiOmbudsmanModule {
  static register(
    config: ComplaintToAlthingiOmbudsmanClientConfig,
  ): DynamicModule {
    if (!config.xRoadBaseUrl) {
      logger.error('ComplaintToAlthingiOmbudsmanClient xRoadPath not provided.')
    }
    if (!config.password) {
      logger.error('ComplaintToAlthingiOmbudsmanClient password not provided.')
    }
    if (!config.username) {
      logger.error('ComplaintToAlthingiOmbudsmanClient username not provided.')
    }
    if (!config.xRoadClientId) {
      logger.error(
        'ComplaintToAlthingiOmbudsmanClient xRoadClientId not provided.',
      )
    }
    if (!config.XRoadProviderId) {
      logger.error(
        'ComplaintToAlthingiOmbudsmanClient XRoadProviderId not provided.',
      )
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
      module: ClientsAlthingiOmbudsmanModule,
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
