import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'

import { Injectable, Inject } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

export interface NovaResponse {
  Code: number
  Message: string
}

interface NovaAuthResponse extends NovaResponse {
  Token: string
}

export class NovaError extends Error {
  constructor(code: number, message: string) {
    super()
    const errorCodes = {
      '0': 'Code 0: Operation Successful',
      '1': 'Code 1: Action failed',
      '10': 'Code 10: Authentication Failure',
      '20': 'Code 20: Failure during token generation',
      '30': 'Code 30: Missing login credentials',
      '1001': 'Code 1001: Unexpected Error',
    }
    let codeMessage = `Unknown error code: ${code}`
    if (code && Object.keys(errorCodes).includes(code.toString())) {
      codeMessage = errorCodes[code.toString()]
    }
    this.name = 'NovaError'
    this.message = `${codeMessage}, ${message}`
  }
}

let token: string = undefined

export interface SmsServiceOptions {
  url: string
  username: string
  password: string
}

@Injectable()
export class SmsService extends RESTDataSource {
  constructor(
    @Inject('SMS_OPTIONS')
    private options: SmsServiceOptions,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    super()

    this.baseURL = `${this.options.url}/NovaSmsService/`
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
  }

  private async login(): Promise<string> {
    try {
      const res: NovaAuthResponse = await this.post('Login', undefined, {
        headers: {
          username: this.options.username,
          password: this.options.password,
        },
      })

      this.logger.info('Successfully authenticated with Nova')

      return res.Token
    } catch (error) {
      const code = error?.extensions?.response?.body?.Code
      const message =
        error?.extensions?.response?.body?.Message || error.message
      throw new NovaError(code, message)
    }
  }

  private async wrappedPost(
    url: string,
    body: object,
    isRetry = false,
  ): Promise<NovaResponse> {
    if (!token) {
      token = await this.login()
    }

    try {
      return this.post(url, body, {
        headers: {
          token,
        },
      })
    } catch (error) {
      // Nova token is only valid for 24 hours
      const status = error?.extensions?.response?.status

      if (!isRetry && status === 401) {
        this.logger.info('Nova returned 401, refreshing auth token')

        token = await this.login()

        return this.wrappedPost(url, body, true)
      }

      const code = error?.extensions?.response?.body?.Code
      const message =
        error?.extensions?.response?.body?.Message || error.message

      throw new NovaError(code, message)
    }
  }

  sendSms(mobileNumber: string, message: string): Promise<NovaResponse> {
    this.logger.debug(`Sending sms to ${mobileNumber} with message ${message}`)

    const body = {
      request: {
        Recipients: [mobileNumber],
        SenderName: 'Island.is',
        SmsText: message,
        IsFlash: false,
      },
    }

    return this.wrappedPost('SendSms', body)
  }
}
