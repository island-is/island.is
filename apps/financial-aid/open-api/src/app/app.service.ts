import fetch from 'isomorphic-fetch'

import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import appModuleConfig from './app.config'

@Injectable()
export class AppService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getApplications(apiKey: string) {
    console.log('kemst hingad')

    return fetch(
      `${this.config.backend.url}/api/financial-aid/open-api-applications/getAll`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
      },
    ).then(async (res) => {
      console.log('res', res)
      return res.json()
    })
  }
}
