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
    logger.info('Starting cms import worker...')

    await this.processGrants()

    logger.info('...cms import worker finished.')
  }

  private parseGrantDate = (date: Date): { date: string; hour?: number } => {
    const dateHour: number = date.getHours()

    const parsedDate = {
      date: date.toISOString().split('T')[0],
    }

    if (dateHour > 0 && dateHour < 24) {
      return {
        ...parsedDate,
        hour: dateHour,
      }
    }

    if (dateHour === 0) {
      return {
        ...parsedDate,
        hour: 0,
      }
    }

    return parsedDate
  }

  private async processGrants() {
    const [cmsGrants, clientGrants] = await Promise.all([
      this.cmsRepository.getContentfulGrants(),
      this.clientsRepository.getGrants(),
    ])

    const grantsToUpdate: CmsGrantInput = clientGrants
      .map((grant) => {
        const clientGrant = cmsGrants.find((cg) => cg.grantId === grant.id)

        if (!clientGrant) {
          logger.debug('No matching client grant discovered, aborting...', {
            grantId: grant.id,
          })
          return
        }

        logger.info('Grant matched to contentful grant, checking for updates', {
          referenceId: clientGrant.referenceId,
        })

        const grantDateFrom = grant.dateFrom
          ? new Date(grant.dateFrom)
          : undefined
        const grantDateTo = grant.dateTo ? new Date(grant.dateTo) : undefined

        if (!grantDateFrom || !grantDateTo) {
          logger.warn('Missing dateFrom or dateTo in grant, aborting...', {
            referenceId: clientGrant.referenceId,
          })
          return
        }

        if (
          Number.isNaN(grantDateFrom.getTime()) ||
          Number.isNaN(grantDateTo.getTime())
        ) {
          logger.warn('Invalid dateFrom or dateTo in grant, aborting...', {
            referenceId: clientGrant.referenceId,
          })
          return
        }

        if (grantDateFrom.getTime() > grantDateTo.getTime()) {
          logger.warn(
            'Invalid dates, DateFrom is after DateTo in grant, aborting...',
            {
              referenceId: clientGrant.referenceId,
            },
          )
          return
        }

        const parsedGrantDateTo = this.parseGrantDate(grantDateTo)
        const parsedGrantDateFrom = this.parseGrantDate(grantDateFrom)

        logger.info('Grant values parsed successfully', {
          referenceId: clientGrant.referenceId,
        })

        return {
          referenceId: clientGrant.referenceId,
          cmsGrantEntry: clientGrant.entry,
          inputFields: [
            {
              key: 'grantDateFrom',
              value: parsedGrantDateFrom.date,
            },
            {
              key: 'grantDateTo',
              value: parsedGrantDateTo.date,
            },
            parsedGrantDateFrom.hour
              ? {
                  key: 'grantOpenFromHour',
                  value:
                    parsedGrantDateFrom.hour === 0
                      ? undefined
                      : parsedGrantDateFrom.hour,
                }
              : undefined,
            parsedGrantDateTo.hour
              ? {
                  key: 'grantOpenToHour',
                  value:
                    parsedGrantDateTo.hour === 0
                      ? undefined
                      : parsedGrantDateTo.hour,
                }
              : undefined,
          ].filter(isDefined),
        }
      })
      .filter(isDefined)

    logger.info('All grants processed. Continuing to update...')
    return await this.cmsRepository.updateContentfulGrants(grantsToUpdate)
  }
}
