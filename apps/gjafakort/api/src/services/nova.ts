import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'

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
      '0': 'Code: 0 => Operation Successful',
      '1': 'Code: 1 => Action failed',
      '10': 'Code: 10 => Authentication Failure',
      '20': 'Code: 20 => Failure during token generation',
      '30': 'Code: 30 => Missing login credentials',
      '1001': 'Code: 1001 => Unexpected Error',
    }
    let codeMessage = `Unknown error code: ${code}`
    if (Object.keys(errorCodes).includes(code.toString())) {
      codeMessage = errorCodes[code.toString()]
    }
    this.name = 'NovaError'
    this.message = `${codeMessage}, ${message}`
  }
}

class NovaAPI extends RESTDataSource {
  baseURL = `${nova.url}/NovaSmsService/`

  token = undefined

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
  }

  async login(): Promise<string> {
    const res: NovaAuthResponse = await this.get('Login', undefined, {
      headers: {
        username: nova.username,
        password: nova.password,
      },
    })
    if (res.Code !== 0) {
      throw new NovaError(res.Code, res.Message)
    }
    return res.Token
  }

  async wrappedPost(url, body, isRetry = false) {
    if (!this.token) {
      this.token = await this.login()
    }

    const res: NovaResponse = await this.post(url, body, {
      headers: {
        token: this.token,
      },
    })

    // Nova token is only valid for 24 hours
    if (!isRetry && res.Code === 10) {
      // TODO status 401
      this.token = await this.login()
      return this.wrappedPost(url, body, true)
    }
    if (res.Code !== 0) {
      throw new NovaError(res.Code, res.Message)
    }
    return res
  }

  async sendSms(mobileNumber: string, confirmationCode: string) {
    const body = {
      request: {
        Recipients: [mobileNumber],
        SenderName: 'Ferðagjöf', // TODO get correct sendername and smstext
        SmsText: `Staðfestingarkóði: ${confirmationCode}`,
        IsFlash: false,
      },
    }
    return this.wrappedPost(`SendSms`, body)
  }
}

export default NovaAPI
