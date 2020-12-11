import fetch from 'node-fetch'
import FormData from 'form-data'
import * as AWS from 'aws-sdk'
import aws4 from 'aws4'
import util from 'util'
import fs from 'fs'
import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { KibanaSavedObject } from '@island.is/content-search-indexer/types'

import { environment } from '../environments/environment'

const readFile = util.promisify(fs.readFile)

const { kibana, awsWebIdentityTokenFile, awsRoleName } = environment

interface ImportSavedObjectsResponse {
  success: boolean
  successCount: number
}

interface ApiParams {
  url: URL
  method: 'GET' | 'POST'
  body?: FormData
}

@Injectable()
export class KibanaService {
  constructor() {
    logger.debug('Created Kibana Service')
  }

  private async fetchSignedHeaders({
    url,
    method,
    body,
  }: ApiParams): Promise<object> {
    const sts = new AWS.STS()
    const token = await readFile(awsWebIdentityTokenFile)
    const { Credentials } = await sts
      .assumeRoleWithWebIdentity({
        RoleArn: awsRoleName,
        RoleSessionName: 'kibana',
        WebIdentityToken: token.toString(),
      })
      .promise()

    const opts = {
      host: url.hostname,
      path: url.pathname,
      method,
      body,
    }
    const signed = aws4.sign(opts, {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretAccessKey,
      sessionToken: Credentials.SessionToken,
    })

    return signed.headers
  }

  private async callApi({ url, method, body }: ApiParams) {
    try {
      let headers = { 'kbn-xsrf': 'true' }
      if (awsWebIdentityTokenFile && awsRoleName) {
        const signedHeaders = await this.fetchSignedHeaders({
          url,
          method,
          body,
        })
        headers = { ...headers, ...signedHeaders }
      }
      const response = await fetch(url.href, {
        method,
        body,
        headers,
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
