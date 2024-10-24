import { AppRepository } from './app.repository'
import { GrantDto, GrantsService } from '@island.is/clients/grants'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { isGrantAvailable } from './utils/isGrantAvailable'

@Injectable()
export class AppService {
  constructor(
    private readonly repository: AppRepository,
    private readonly grantsService: GrantsService,
  ) {}

  public async run() {
    logger.debug('Starting cms import worker...')

    const grants = (await this.grantsService.getGrants()).map((g) => {
      return {
        applicationId: g.applicationId,
        inputFields: this.parseGrantInputFields(g),
      }
    })

    await this.repository.updateGrants(grants)
    logger.debug('Cms import worker done.')
  }

  private parseGrantInputFields = (grant: GrantDto) => {
    const isOpen = isGrantAvailable(grant.dateFrom, grant.dateTo)
    const inputFields: Array<{ key: string; value: unknown }> = []

    if (grant.dateFrom) {
      inputFields.push({ key: 'grantDateFrom', value: grant.dateFrom })
    }
    if (grant.dateTo) {
      inputFields.push({ key: 'grantDateTo', value: grant.dateTo })
    }
    if (isOpen) {
      inputFields.push({ key: 'grantIsOpen', value: isOpen })
    }
    return inputFields
  }
}
