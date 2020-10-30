import { Fjarsysla } from '.'
import { Base64 } from 'js-base64'
import { Injectable, HttpService, Inject } from '@nestjs/common'
import { environment } from '../../../../environments'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class FjarsyslaService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private httpService: HttpService,
  ) {}

  async getFjarsysluRest(nationalId: string, permno: string) {
    function fjarsyslaReturn(bool: boolean) {
      return new Fjarsysla(bool)
    }
    try {
      this.logger.info(
        `---- Starting FjarsyslaRest request on ${nationalId} with number ${permno} ----`,
      )

      const { restUrl, restUsername, restPassword } = environment.fjarsysla

      const data = JSON.stringify({
        fastnr: permno,
        kennitala: nationalId,
        tilvisun: '//ToDo: what is tilvisun',
      })

      const headersRequest = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Base64.encode(
          `${restUsername}:${restPassword}`,
        )}`,
      }
      const response = await this.httpService
        .post(restUrl, data, { headers: headersRequest })
        .toPromise()
      if (!response) {
        this.logger.error('API call is not success')
        return fjarsyslaReturn(false)
      }
      if (response.status < 300 && response.status > 199) {
        this.logger.info(
          `---- Finished FjarsyslaRest request on ${nationalId} with number ${permno} ----`,
        )
        return fjarsyslaReturn(true)
      } else {
        this.logger.error(response.statusText)
        return fjarsyslaReturn(false)
      }
    } catch (err) {
      this.logger.error(err)
      return fjarsyslaReturn(false)
    }
  }
}
