import { DynamicModule } from '@nestjs/common'
import fetch from 'isomorphic-fetch'

import { logger } from '@island.is/logging'

import {
  Configuration,
  ParentalLeaveApi,
  PensionApi,
  PregnancyApi,
  UnionApi,
} from '../../gen/fetch'

export interface VMSTClientModuleConfig {
  apiKey: string
  xRoadPath: string
  xRoadClient: string
}

const stringify = (json: unknown) => {
  try {
    return JSON.stringify(json, null, '  ')
  } catch {
    return json
  }
}

const wrappedFetchForLogging = (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  logger.info('VMST Client request')
  logger.info(stringify(input))
  if (init) {
    logger.info(
      stringify({
        ...init,
        headers: {
          ...(init['headers'] || {}),
          'api-key': 'hidden',
        },
      }),
    )
  }
  return new Promise((resolve, reject) => {
    fetch(input, init)
      .then((response) => {
        logger.info('VMST Client response')
        logger.info(
          stringify({
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
          }),
        )
        resolve(response)
      })
      .catch((error) => {
        logger.info('VMST Client error')
        logger.info(stringify(error))
        reject(error)
      })
  })
}

export class VMSTClientModule {
  static register(config: VMSTClientModuleConfig): DynamicModule {
    const headers = {
      'api-key': config.apiKey,
      'X-Road-Client': config.xRoadClient,
    }

    const providerConfiguration = new Configuration({
      fetchApi: wrappedFetchForLogging,
      basePath: config.xRoadPath,
      headers,
    })

    const exportedApis = [ParentalLeaveApi, PensionApi, PregnancyApi, UnionApi]

    return {
      module: VMSTClientModule,
      providers: exportedApis.map((Api) => ({
        provide: Api,
        useFactory: () => new Api(providerConfiguration),
      })),
      exports: exportedApis,
    }
  }
}
