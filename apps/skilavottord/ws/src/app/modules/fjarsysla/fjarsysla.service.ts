import { Base64 } from 'js-base64'
import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'

import { environment } from '../../../environments'

@Injectable()
export class FjarsyslaService {
  constructor(private httpService: HttpService) {}

  async getFjarsysluRest(nationalId: string, permno: string, id: string) {
    try {
      const { restUrl, restUsername, restPassword } = environment.fjarsysla

      const data = JSON.stringify({
        fastnr: permno,
        kennitala: nationalId,
        tilvisun: id,
      })

      const headersRequest = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Base64.encode(
          `${restUsername}:${restPassword}`,
        )}`,
      }
      const response = await lastValueFrom(
        this.httpService.post(restUrl, data, { headers: headersRequest }),
      )
      if (!response) {
        throw new Error(
          `Failed on FjarsyslaRest request with error: ${response.statusText}`,
        )
      }
      if (response.status < 300 && response.status > 199) {
        return true
      } else {
        throw new Error(
          `Failed on FjarsyslaRest with status code: ${response.statusText}`,
        )
      }
    } catch (err) {
      throw new Error(`Failed on FjarsyslaRest request with error: ${err}`)
    }
  }
}
