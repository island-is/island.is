import { DataSource } from 'apollo-datasource'
import { createHash } from 'crypto'
import FormData from 'form-data'
import { Base64 } from 'js-base64'
import fetch from 'node-fetch'

import { Inject, Injectable } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { signingModuleConfig } from './signing.config'

export class SigningServiceResponse {
  @ApiProperty()
  controlCode?: string

  @ApiProperty()
  documentToken?: string
}

export class DokobitError extends Error {
  constructor(
    public readonly status: number, // Suggested status to return from an API call
    public readonly code: number, // Dokobit error code
    message: string, // Dokobit error message
  ) {
    super()

    this.name = 'DokobitError'
    this.message = `${message}`
  }
}

interface DokobitSignResponse {
  status: string
  control_code: string
  token: string
  error_code: number
  message: string
}

interface DokobitStatusResponse {
  status: string
  file: {
    name: string
    digest: string
    content: string
  }
  signature_id: string
  error_code: number
  message: string
}

@Injectable() // extends RESTDataSource
export class SigningService extends DataSource {
  constructor(
    @Inject(signingModuleConfig.KEY)
    private readonly config: ConfigType<typeof signingModuleConfig>,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    super()
  }

  private getVerifiedDocument(
    documentName: string,
    resStatus: DokobitStatusResponse,
  ) {
    if (resStatus.file.name !== documentName) {
      throw new DokobitError(
        502, // Bad gateway
        99999,
        'File name verification failed',
      )
    }

    const base64 = resStatus.file.content

    const documentContent = Base64.atob(base64)
    const digest = createHash('sha1')
      .update(documentContent, 'ascii')
      .digest('hex')

    if (digest !== resStatus.file.digest) {
      throw new DokobitError(
        502, // Bad gateway
        99999,
        'Checksum verification failed',
      )
    }

    return documentContent
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async requestSignature(
    mobileNumber: string,
    message: string,
    contact: string,
    location: string,
    documentName: string,
    documentContent: string,
  ): Promise<SigningServiceResponse> {
    this.logger.debug(
      `${contact} ${location} is requesting ${mobileNumber} to sign ${documentName} with message ${message}`,
    )

    if (!this.config.production && !this.config.accessToken) {
      // Local development mode without an access token
      return { controlCode: '0000', documentToken: 'DEVELOPMENT' }
    }

    const base64 = Base64.btoa(documentContent)
    const digest = createHash('sha1')
      .update(documentContent, 'ascii')
      .digest('hex')

    const form = new FormData()
    form.append('phone', `+354${mobileNumber}`)
    // We need the extra space at the end to separate the message from
    // the four digit control code displayed on the mobile screen
    form.append('message', `${message} `)
    form.append('timestamp', 'true')
    form.append('language', 'IS')
    form.append('pdf[contact]', contact)
    form.append('pdf[location]', location)
    form.append('type', 'pdf')
    form.append('pdf[files][0][name]', documentName)
    form.append('pdf[files][0][content]', base64)
    form.append('pdf[files][0][digest]', digest)

    const res = await fetch(
      `${this.config.url}/mobile/sign.json?access_token=${this.config.accessToken}`,
      {
        method: 'POST',
        body: form,
      },
    )

    const resSign: DokobitSignResponse = await res.json()

    if (resSign.status !== 'ok') {
      throw new DokobitError(res.status, resSign.error_code, resSign.message)
    }

    return { controlCode: resSign.control_code, documentToken: resSign.token }
  }

  async waitForSignature(
    documentName: string,
    documentToken: string,
    method: 'mobile' | 'audkenni' = 'mobile',
  ): Promise<string> {
    if (!this.config.production && !this.config.accessToken) {
      // Local development mode without an access token
      return "%PDF-1.2 \n9 0 obj\n<<\n>>\nstream\nBT/ 32 Tf(  TESTING   )' ET\nendstream\nendobj\n4 0 obj\n<<\n/Type /Page\n/Parent 5 0 R\n/Contents 9 0 R\n>>\nendobj\n5 0 obj\n<<\n/Kids [4 0 R ]\n/Count 1\n/Type /Pages\n/MediaBox [ 0 0 175 50 ]\n>>\nendobj\n3 0 obj\n<<\n/Pages 5 0 R\n/Type /Catalog\n>>\nendobj\ntrailer\n<<\n/Root 3 0 R\n>>\n%%EOF"
    }

    const urlPath = method === 'audkenni' ? 'audkenniapp' : 'mobile'

    // Try to retrieve the signed document
    // The Dokobit API returns pretty much immediately from the status call
    // At the same time, the user gets a long time to complete the signature
    // We need to try longer than the signature timeout, but not too long
    // Later, we may decide to return after one call and let the caller handle retries
    for (
      let i = 1;
      i < this.config.pollDurationSeconds / this.config.pollIntervalSeconds;
      i++
    ) {
      // Wait a second
      await this.delay(this.config.pollIntervalSeconds * 1000)

      const res = await fetch(
        `${this.config.url}/${urlPath}/sign/status/${documentToken}.json?access_token=${this.config.accessToken}`,
      )

      const resStatus: DokobitStatusResponse = await res.json()

      if (resStatus.status === 'ok') {
        return this.getVerifiedDocument(documentName, resStatus)
      }

      if (resStatus.status !== 'waiting') {
        throw new DokobitError(
          res.status,
          resStatus.error_code,
          resStatus.message,
        )
      }
    }

    throw new DokobitError(
      408, // Timeout
      99999,
      'Timeout while retrieving document',
    )
  }

  async requestSignatureAudkenni(
    nationalId: string,
    contact: string,
    location: string,
    documentName: string,
    documentContent: string,
    message?: string,
  ): Promise<SigningServiceResponse> {
    this.logger.debug(
      `${contact} ${location} is requesting ${nationalId} to sign ${documentName} via Audkenni App`,
    )

    if (!this.config.production && !this.config.accessToken) {
      // Local development mode without an access token
      return { controlCode: '0000', documentToken: 'DEVELOPMENT' }
    }

    const base64 = Base64.btoa(documentContent)
    const digest = createHash('sha1')
      .update(documentContent, 'ascii')
      .digest('hex')

    const form = new FormData()
    form.append('code', nationalId)
    form.append('timestamp', 'true')
    form.append('type', 'pdf')
    form.append('pdf[contact]', contact)
    form.append('pdf[location]', location)
    form.append('pdf[files][0][name]', documentName)
    form.append('pdf[files][0][content]', base64)
    form.append('pdf[files][0][digest]', digest)

    message && form.append('message', message)

    const res = await fetch(
      `${this.config.url}/audkenniapp/sign.json?access_token=${this.config.accessToken}`,
      {
        method: 'POST',
        body: form,
      },
    )

    const resSign: DokobitSignResponse = await res.json()

    if (resSign.status !== 'ok') {
      throw new DokobitError(res.status, resSign.error_code, resSign.message)
    }

    return { controlCode: resSign.control_code, documentToken: resSign.token }
  }
}
