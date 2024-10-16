import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { environment } from '../../../../environments'
import { logger } from '@island.is/logging'

@Injectable()
export class TransportService {
  constructor(private httpService: HttpService) {}

  async authenticate(url: string, apiVersion = '1.0'): Promise<string> {
    try {
      const { restUsername, restPassword } = environment.samgongustofa

      if (!restUsername || !restPassword) {
        throw new Error('Missing environment variables for Samgöngustofa')
      }

      const jsonObj = {
        username: restUsername,
        password: restPassword,
      }
      const jsonAuthBody = JSON.stringify(jsonObj)

      const headerAuthRequest = {
        'Content-Type': 'application/json',
        'Api-version': apiVersion,
      }

      const authRes = await lastValueFrom(
        this.httpService.post(url + 'authenticate', jsonAuthBody, {
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

  /**
   *
   * @param restURL - the base Samgöngustofa API url
   * @param fullUrl - the full url to the Samgöngustofa API endpoint
   * @param apiVersion - Samgöngustofa API version
   * @returns
   */
  async doGet(restURL: string, fullUrl: string, apiVersion: string) {
    const jwtToken = await this.authenticate(restURL, apiVersion)

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwtToken,
      'Api-version': apiVersion,
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

  /**
   * Get the Samgöngustofa's registration REST url
   * @returns
   */
  getRegistrationURL(): string {
    const { restDeRegUrl } = environment.samgongustofa

    const positionOfChar = restDeRegUrl.lastIndexOf('/')
    return restDeRegUrl.substring(0, positionOfChar) + '/'
  }

  /**
   * Get the Samgöngustofa's information REST url
   * @returns
   */
  getInformationURL(): string {
    const { restDeRegUrl } = environment.samgongustofa

    //
    // Small hack to get the information url
    const restInformationURL = restDeRegUrl.replace(
      '/registrations/',
      '/information/',
    )
    const positionOfChar = restInformationURL.lastIndexOf('/')
    return restInformationURL.substring(0, positionOfChar) + '/'
  }
}
