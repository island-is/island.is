import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { environment } from '../../../../environments'
import { logger } from '@island.is/logging'

@Injectable()
export class TransportService {
  constructor(private httpService: HttpService) {}

  async authenticate() {
    try {
      const { restAuthUrl, restUsername, restPassword } =
        environment.samgongustofa

      if (!restAuthUrl || !restUsername || !restPassword) {
        throw new Error('Missing environment variables for Samgöngustofa')
      }

      const jsonObj = {
        username: restUsername,
        password: restPassword,
      }
      const jsonAuthBody = JSON.stringify(jsonObj)

      const headerAuthRequest = {
        'Content-Type': 'application/json',
        'Api-version': '3.0',
      }

      const authRes = await lastValueFrom(
        this.httpService.post(restAuthUrl, jsonAuthBody, {
          headers: headerAuthRequest,
        }),
      )

      if (authRes.status > 299 || authRes.status < 200) {
        const errorMessage = `Authentication failed to Samgöngustofa services: ${authRes.statusText}`
        logger.error(`car-recycling: ${errorMessage}`)
        throw new Error(errorMessage)
      }

      return authRes.data['jwtToken']
    } catch (error) {
      if (error?.config) {
        error.config.data = undefined
      }

      logger.error('car-recycling: Authentication failed', error)
      throw error
    }
  }

  async doGet(
    restURL: string,
    queryParams: { [key: string]: string } | undefined,
  ) {
    const jwtToken = await this.authenticate()

    let fullUrl = restURL

    if (queryParams) {
      const searchParams = new URLSearchParams(queryParams)

      // Concatenate the URL with the query string
      fullUrl = `${restURL}?${searchParams.toString()}`
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwtToken,
    }

    const result = await lastValueFrom(
      this.httpService.get(fullUrl, {
        headers: headers,
      }),
    )

    if (result.status < 300 && result.status >= 200) {
      return result
    } else {
      throw new Error(
        `car-recycling: Failed on doGet with status: ${result.statusText}`,
      )
    }
  }

  // Hack to re-use the url from the secret
  getRegistrationURL(): string {
    const { restDeRegUrl } = environment.samgongustofa

    const positionOfChar = restDeRegUrl.lastIndexOf('/')
    return restDeRegUrl.substring(0, positionOfChar) + '/'
  }
}
