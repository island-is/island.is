import { AppRepository } from './app.repository'
import { GrantDto, GrantsService } from '@island.is/clients/grants'
import { CmsGrant } from './app.types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { createClient as createManagementClient } from 'contentful-management'
import { isGrantAvailable } from './utils/isGrantAvailable'

@Injectable()
export class AppService {
  constructor(
    private readonly repository: AppRepository,
    private readonly grantsService: GrantsService,
  ) {}

  public async run() {
    logger.debug('Starting cms import worker...')
    const client = createManagementClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string,
    })

    const grants = (await this.grantsService.getGrants()).map((g) => {
      return {
        ...g,
        inputFields: this.parseGrantInputFields(g),
      }
    })

    const promises = grants.map((u) =>
      this.updateContentfulGrantEntry(u.applicationId, u.inputFields),
    )

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

  async updateContentfulGrantEntry(
    applicationId: string,
    inputFields: Array<{ key: string; value: unknown }>,
  ) {
    let res: {
      ok: 'success' | 'error'
      message?: string
    }
    try {
      res = await this.repository.updateGrant(applicationId, inputFields)
    } catch (e) {
      logger.warn(e.message)
      res = {
        ok: 'error',
        message: e.message,
      }
    }

    if (res.ok === 'success') {
      logger.debug(`Contentufl entry updated. Data: ${res.message}`)
      return
    }

    logger.debug(`Contentufl entry update failed. ${res.message}`)
    return
  }
}
