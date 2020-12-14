import fetch from 'node-fetch'
import FormData from 'form-data'
import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { KibanaSavedObject } from '@island.is/content-search-indexer/types'

import { environment } from '../environments/environment'

const { kibana } = environment

interface ImportSavedObjectsResponse {
  success: boolean
  successCount: number
}

@Injectable()
export class KibanaService {
  constructor() {
    logger.debug('Created Kibana Service')
  }

  private async callApi({
    url,
    method,
    body,
  }: {
    url: URL
    method: 'GET' | 'POST'
    body?: FormData
  }) {
    try {
      const response = await fetch(url.href, {
        method,
        body,
        headers: {
          'kbn-xsrf': 'true',
        },
      })

      if (!response.ok) {
        const data = await response.text()
        throw new Error(data)
      }

      return await response.json()
    } catch (error) {
      logger.error('Kibana api request failed', error)
      throw error
    }
  }

  async importSavedObjects(file: string): Promise<ImportSavedObjectsResponse> {
    const form = new FormData()
    form.append('file', file, 'saved-objects.ndjson')

    const url = new URL(`${kibana.url}/api/saved_objects/_import`)
    url.search = new URLSearchParams({ overwrite: 'true' }).toString()

    return await this.callApi({ url, method: 'POST', body: form })
  }

  async findSavedObject(id: string, type: string): Promise<KibanaSavedObject> {
    const url = new URL(`${kibana.url}/api/saved_objects/${type}/${id}`)
    return await this.callApi({ url, method: 'GET' })
  }
}
