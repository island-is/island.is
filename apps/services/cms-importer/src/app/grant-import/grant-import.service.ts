import { Injectable } from '@nestjs/common'
import { CmsRepository } from '../repositories/cms/cms.repository'
import { GrantsRepository } from '../repositories/grants/grants.repository'
import { logger } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'
import { parseGrantDate } from './utils'
import { CONTENT_TYPE, LOCALE } from '../constants'
import { EntryUpdateDto } from '../repositories/cms/cms.types'
import { parseReferenceId } from '../utils'

@Injectable()
export class GrantImportService {
  constructor(
    private readonly cmsRepository: CmsRepository,
    private readonly clientsRepository: GrantsRepository,
  ) {}

  public async run() {
    logger.info('Grant import worker starting...')
    await this.processGrants()
    logger.info('...grant import worker finished.')
  }

  private getContentfulGrants = async () => {
    const grants = await this.cmsRepository.getContentByType(CONTENT_TYPE)
    return grants
      .map((grant) => {
        const referenceId =
          grant.fields?.['grantApplicationId']?.[LOCALE] ?? undefined
        const dateFrom = grant.fields?.['grantDateFrom']?.[LOCALE] ?? undefined
        const dateTo = grant.fields?.['grantDateTo']?.[LOCALE] ?? undefined
        const status = grant.fields?.['grantStatus']?.[LOCALE] ?? undefined

        if (referenceId < 0 || status !== 'Automatic') {
          return
        }
        const grantId = parseReferenceId(referenceId)

        if (!grantId) {
          logger.warn('Invalid grant id, aborting...', {
            referenceId: grantId,
          })
          return
        }

        return {
          entry: grant,
          id: grant.sys.id,
          referenceId,
          grantId,
          dateFrom,
          dateTo,
        }
      })
      .filter(isDefined)
  }

  private async processGrants() {
    const [cmsGrants, clientGrants] = await Promise.all([
      this.getContentfulGrants(),
      this.clientsRepository.getGrants(),
    ])

    const grantsToUpdate: Array<EntryUpdateDto> = clientGrants
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

        const parsedGrantDateTo = parseGrantDate(grantDateTo)
        const parsedGrantDateFrom = parseGrantDate(grantDateFrom)

        logger.info('Grant values parsed successfully', {
          referenceId: clientGrant.referenceId,
        })

        return {
          referenceId: clientGrant.referenceId,
          cmsEntry: clientGrant.entry,
          inputFields: {
            [LOCALE]: [
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
          },
        }
      })
      .filter(isDefined)

    logger.info('All grants processed. Continuing to update...')
    return await this.cmsRepository.updateEntries(grantsToUpdate, CONTENT_TYPE)
  }
}
