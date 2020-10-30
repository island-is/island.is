import { Fjarsysla } from '.'
import { Injectable, Inject } from '@nestjs/common'
import { environment } from '../../../../environments'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class FjarsyslaService {
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {}

  async getFjarsysluRest(nationalId: string, permno: string) {
    try {
      this.logger.info(
        `---- Starting FjarsyslaRest request on ${nationalId} with ${permno} ----`,
      )

      return new Fjarsysla(true)
    } catch (err) {
      this.logger.error(err)
      return new Fjarsysla(false)
    }
  }
}
