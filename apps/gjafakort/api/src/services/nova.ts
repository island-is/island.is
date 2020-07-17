import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'

import { logger } from '@island.is/logging'

import { environment } from '../environments'

const { nova } = environment

interface NovaResponse {
  Code: number
  Message: string
}

interface NovaAuthResponse extends NovaResponse {
  Token: string
}

class NovaError extends Error {
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

let token = undefined

class NovaAPI extends RESTDataSource {
  baseURL = `${nova.url}/NovaSmsService/`

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
  }

  async login(): Promise<string> {
    try {
      const res: NovaAuthResponse = await this.post('Login', undefined, {
        headers: {
          username: nova.username,
          password: nova.password,
        },
      })
      logger.info('Authenticated with nova successfully')
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
      const res = await this.post(url, body, {
        headers: {
          token,
        },
      })
      return res
    } catch (error) {
      // Nova token is only valid for 24 hours
      const status = error?.extensions?.response?.status
      const code = error?.extensions?.response?.body?.Code
      const message =
        error?.extensions?.response?.body?.Message || error.message
      if (!isRetry && status === 401) {
        logger.info('Nova returned 401, refreshing auth token')
        token = await this.login()
        return this.wrappedPost(url, body, true)
      }
      throw new NovaError(code, message)
    }
  }

  async sendSms(
    mobileNumber: string,
    confirmationCode: string,
  ): Promise<NovaResponse> {
    const body = {
      request: {
        Recipients: [mobileNumber],
        SenderName: 'Island.is',
        SmsText: `Staðfestingarkóði: ${confirmationCode}`,
        IsFlash: false,
      },
    }
    logger.debug(`Sending sms to ${mobileNumber} with code ${confirmationCode}`)
    return this.wrappedPost(`SendSms`, body)
  }
}

export default NovaAPI
