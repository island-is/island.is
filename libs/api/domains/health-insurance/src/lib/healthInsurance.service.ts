import { PersonApi } from '@island.is/clients/health-insurance-v2'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import type { Logger } from '@island.is/logging'
@Injectable()
export class HealthInsuranceService {
  constructor(
    private readonly personApi: PersonApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  // return true or false when asked if person is health insured
  async isHealthInsured(nationalId: string, date: Date): Promise<boolean> {
    const formattedDate = format(new Date(date), 'yyyy-MM-dd', {
      locale: is,
    })
    return await this.personApi
      .personIsHealthInsured({
        date: formattedDate,
        nationalID: nationalId,
      })
      .then((resp) => {
        return resp.isHealthInsured === 1
      })
      .catch((err) => {
        this.logger.error('Error fetching health insurance data', err)
        return false
      })
  }
}
