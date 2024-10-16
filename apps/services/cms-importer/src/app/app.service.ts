import { Inject, Injectable } from '@nestjs/common'
import { AppRepository } from './app.repository'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { GrantsService } from '@island.is/clients/grants'
import { GrantType } from './dto/grantType.dto'
import { CmsGrant } from './app.types'

@Injectable()
export class AppService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly repository: AppRepository,
    private readonly grantsService: GrantsService,
  ) {}

  public async run() {
    this.logger.debug('Starting cms import worker...')
    await this.updateGrants()
    this.logger.debug('Cms import worker done.')
  }

  async getGrants() {
    return this.grantsService.getGrants()
  }

  async updateGrants() {
    const grants = await this.getGrants()
    const cmsGrants = await this.repository.getGrants()

    const parseIsOpen = (
      dateFrom?: string,
      dateTo?: string,
    ): boolean | undefined => {
      if (!dateFrom) {
        return false
      }
      const typedDateFrom = new Date(dateFrom)

      //invalid date format
      if (Number.isNaN(typedDateFrom)) {
        return
      }

      const today = new Date()

      //if today is earlier than date from, it's not open
      if (today < typedDateFrom) {
        return false
      }

      //if no date to, it's endless
      if (!dateTo) {
        return true
      }

      const typedDateTo = new Date(dateTo)

      if (Number.isNaN(typedDateFrom)) {
        return
      }

      return today < typedDateTo
    }

    const grantUpdates = grants.map((g) => {
      const isOpen = parseIsOpen(g.dateFrom, g.dateTo)

      const inputFields: Array<{ key: string; value: unknown }> = []
      if (g.dateFrom) {
        inputFields.push({ key: 'grantDateFrom', value: g.dateFrom })
      }
      if (g.dateTo) {
        inputFields.push({ key: 'grantDateTo', value: g.dateTo })
      }
      if (isOpen) {
        inputFields.push({ key: 'grantIsOpen', value: isOpen })
      }

      this.updateContentfulGrantEntry(g.applicationId, inputFields, cmsGrants)
    })

    return grantUpdates
  }

  async updateContentfulGrantEntry(
    applicationId: string,
    inputFields: Array<{ key: string; value: unknown }>,
    cmsGrants: Array<CmsGrant>,
  ) {
    const cmsId = cmsGrants.find((cg) => cg.applicationId === applicationId)

    if (!cmsId) {
      this.logger.warn('Grant with provided applicationId not found', {
        applicationId: applicationId,
      })
      return null
    }

    this.logger.debug(`Updating contentful entry ${cmsId.id}`)

    const result = await this.repository.updateGrant(applicationId, inputFields)

    console.log(`update result ${JSON.stringify(result)}`)
  }
}
