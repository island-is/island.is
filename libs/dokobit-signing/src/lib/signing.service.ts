import FormData from 'form-data'
import fetch from 'node-fetch'
import { DataSource } from 'apollo-datasource'
import { Base64 } from 'js-base64'
import { createHash } from 'crypto'

import { Injectable, Inject } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

export interface SigningServiceOptions {
  url: string
  accessToken: string
}

export class SigningServiceResponse {
  @ApiProperty()
  controlCode: string

  @ApiProperty()
  documentToken: string
}

export class SigningServiceError extends Error {
  constructor(code: number, message: string) {
    super()

    this.name = 'DokobitError'
    this.message = `${code}: ${message}`
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
    @Inject('SIGNING_OPTIONS')
    private options: SigningServiceOptions,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    super()
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
      `${this.options.url}/mobile/sign.json?access_token=${this.options.accessToken}`,
      {
        method: 'POST',
        body: form,
      },
    )

    const resSign: DokobitSignResponse = await res.json()

    if (resSign.status !== 'ok') {
      throw new SigningServiceError(resSign.error_code, resSign.message)
    }

    return {
      controlCode: resSign.control_code,
      documentToken: resSign.token,
    }
  }

  async getSignedDocument(
    documentName: string,
    documentToken: string,
  ): Promise<string> {
    // Try to retrieve the signed document
    // The Dokobit API returns pretty much immediatly from the status call
    // At the same time, the mobile user gets a long time to complete the signature
    // We need to try longer than the mobile signature timeout, but not too long
    // Later, we may decide to return after one call and let the caller handle retries
    for (let i = 1; i < 120; i++) {
      const res = await fetch(
        `${this.options.url}/mobile/sign/status/${documentToken}.json?access_token=${this.options.accessToken}`,
      )

      const resStatus: DokobitStatusResponse = await res.json()

      if (resStatus.status === 'ok') {
        return this.getVerifiedDocument(documentName, resStatus)
      }

      if (resStatus.status !== 'waiting') {
        throw new SigningServiceError(resStatus.error_code, resStatus.message)
      }

      // Wait a second
      await this.delay(1000)
    }

    throw new SigningServiceError(99999, 'Timeout while retrieving document')
  }

  private getVerifiedDocument(
    documentName: string,
    resStatus: DokobitStatusResponse,
  ) {
    if (resStatus.file.name !== documentName) {
      throw new SigningServiceError(99999, 'File name verification failed')
    }

    const base64 = resStatus.file.content

    const documentContent = Base64.atob(base64)
    const digest = createHash('sha1')
      .update(documentContent, 'ascii')
      .digest('hex')

    if (digest !== resStatus.file.digest) {
      throw new SigningServiceError(99999, 'Checksum verification failed')
    }

    return documentContent
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
