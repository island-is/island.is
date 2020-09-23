import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { Base64 } from 'js-base64'
import { createHash } from 'crypto'

import { Injectable, Inject } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

export interface SigningServiceOptions {
  url: string
  accessToken: string
}

export class SigningServiceResponse {
  controlCode: string
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

@Injectable()
export class SigningService extends RESTDataSource {
  constructor(
    @Inject('SIGNING_OPTIONS') private options: SigningServiceOptions,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    super()

    this.baseURL = `${this.options.url}/mobile/`
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'multipart/form-data')
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

    const base64 = Base64.encode(documentContent)
    const digest = createHash('sha256')
      .update(base64)
      .digest('hex')

    const body = new FormData()
    body.append('phone', mobileNumber)
    body.append('message', `${message} `)
    body.append('timestamp', 'true')
    body.append('language', 'IS')
    body.append('pdf[contact]', contact)
    body.append('pdf[location]', location)
    body.append('type', 'pdf')
    body.append('pdf[files][0][name]', documentName)
    body.append('pdf[files][0][content]', base64)
    body.append('pdf[files][0][digest]', digest)

    const resSign: DokobitSignResponse = await this.post(
      `sign.json?access_token=${this.options.accessToken}`,
      body,
    )

    if (resSign.status !== 'ok') {
      throw new SigningServiceError(resSign.error_code, resSign.message)
    }

    return {
      controlCode: resSign.control_code,
      documentToken: resSign.token,
    }
  }

  async getDocument(
    documentName: string,
    documentToken: string,
  ): Promise<string> {
    let resStatus: DokobitStatusResponse

    // Try to retrieve the signed document
    // Need to try longer than the mobile signature timeout, but not too long
    for (let i = 1; i < 120; i++) {
      resStatus = await this.post(
        `sign/status/${documentToken}.json?access_token=${this.options.accessToken}`,
      )

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
    const digest = createHash('sha256')
      .update(base64)
      .digest('hex')

    if (digest !== resStatus.file.digest) {
      throw new SigningServiceError(99999, 'Checksum verification failed')
    }

    return Base64.atob(base64)
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
