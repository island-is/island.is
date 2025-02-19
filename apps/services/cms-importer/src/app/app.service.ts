import { Injectable } from '@nestjs/common'
import { CmsRepository } from './repositories/cms.repository'
import { ClientGrantsRepository } from './repositories/clientGrants.repository'
import { logger } from '@island.is/logging'
import { CmsGrantInput } from './app.types'
import { isDefined } from '@island.is/shared/utils'

@Injectable()
export class AppService {
  constructor(
    private readonly cmsRepository: CmsRepository,
    private readonly clientsRepository: ClientGrantsRepository,
  ) {}

  public async run() {
    logger.debug('Starting cms import worker...')
    await this.processGrants()
    logger.debug('Cms import worker done.')
  }

  private async processGrants() {
    const [cmsGrants, clientGrants] = await Promise.all([
      this.cmsRepository.getContentfulGrants(),
      this.clientsRepository.getGrants(),
    ])

    const grantsToUpdate: CmsGrantInput = cmsGrants
      .map((grant) => {
        const clientGrant = clientGrants.find(
          (cg) => cg.id === grant.referenceId,
        )

        if (!clientGrant) {
          logger.info('No matching client grant discovered', {
            referenceId: grant.referenceId,
          })
          return
        }

        const grantDateFrom = grant.dateFrom
          ? new Date(grant.dateFrom)
          : undefined
        const grantDateTo = grant.dateTo ? new Date(grant.dateTo) : undefined

        if (!grantDateFrom || !grantDateTo) {
          return
        }

        if (
          Number.isNaN(grantDateFrom.getTime()) ||
          Number.isNaN(grantDateTo.getTime())
        ) {
          return
        }

        if (grantDateFrom.getTime() > grantDateTo.getTime()) {
          return
        }

        return {
          referenceId: clientGrant.id,
          inputFields: [
            {
              key: 'dateFrom',
              value: grantDateFrom.toISOString(),
            },
            {
              key: 'dateTo',
              value: grantDateTo.toISOString(),
            },
          ],
        }
      })
      .filter(isDefined)

    await this.cmsRepository.updateContentfulGrants(grantsToUpdate)
    return
  }
}
