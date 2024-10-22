import fetch from 'node-fetch'
import FormData from 'form-data'
import * as AWS from 'aws-sdk'
import aws4 from 'aws4'
import util from 'util'
import fs from 'fs'
import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { KibanaSavedObject } from '@island.is/content-search-indexer/types'
import { arnType } from 'aws-sdk/clients/sts'

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
  body?: string
  headers?: object
}

@Injectable()
export class KibanaService {
  constructor() {
    logger.info(
      `Created Kibana Service using the url: ${kibana.url} and ${process.env.ELASTIC_NODE}`,
    )
  }

  private async fetchSignedHeaders({
    url,
    method,
    body,
    headers,
  }: ApiParams): Promise<object> {
    const sts = new AWS.STS()
    const token = await readFile(awsWebIdentityTokenFile as string)

    const { Credentials } = await sts
      .assumeRoleWithWebIdentity({
        RoleArn: awsRoleName as arnType,
        RoleSessionName: 'kibana',
        WebIdentityToken: token.toString(),
      })
      .promise()

    if (!Credentials) {
      throw new Error('AWS STS credentials missing.')
    }

    const opts = {
      host: url.hostname,
      path: url.pathname + url.search,
      method,
      body,
      headers,
    }

    const signed = aws4.sign(opts, {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretAccessKey,
      sessionToken: Credentials.SessionToken,
    })

    return signed.headers
  }

  private async callApi({ url, method, body, headers = {} }: ApiParams) {
    try {
      let apiHeaders = { 'kbn-xsrf': 'true', ...headers }

      if (awsWebIdentityTokenFile && awsRoleName) {
        const signedHeaders = await this.fetchSignedHeaders({
          url,
          method,
          body,
          headers: apiHeaders,
        })
        apiHeaders = { ...apiHeaders, ...signedHeaders }
      }

      const response = await fetch(url.href, {
        method,
        body,
        headers: apiHeaders,
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

    return await this.callApi({
      url,
      method: 'POST',
      body: form.getBuffer().toString(),
      headers: form.getHeaders(),
    })
  }

  async findSavedObject(id: string, type: string): Promise<KibanaSavedObject> {
    const url = new URL(`${kibana.url}/api/saved_objects/${type}/${id}`)
    return await this.callApi({ url, method: 'GET' })
  }
}
