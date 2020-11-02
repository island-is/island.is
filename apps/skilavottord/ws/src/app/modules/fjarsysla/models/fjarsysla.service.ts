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
    try {
      this.logger.info(
        `---- Starting FjarsyslaRest request on ${nationalId} with number ${permno} ----`,
      )

      const { restUrl, restUsername, restPassword } = environment.fjarsysla

      const data = JSON.stringify({
        fastnr: permno,
        kennitala: nationalId,
        // ToDo: what is tilvisun?
        tilvisun: 'Stafrænt Ísland - skilagjald',
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
        this.logger.error(response.statusText)
        throw new Error(response.statusText)
      }
      if (response.status < 300 && response.status > 199) {
        this.logger.info(
          `---- Finished FjarsyslaRest request on ${nationalId} with number ${permno} ----`,
        )
        return new Fjarsysla(true)
      } else {
        this.logger.error(response.statusText)
        throw new Error(response.statusText)
      }
    } catch (err) {
      this.logger.error(`Failed on FjarsyslaRest request on ${nationalId} with number ${permno} with: ${err}`)
      throw new Error("Failed on FjarsyslaRest request...")
    }
  }
}
