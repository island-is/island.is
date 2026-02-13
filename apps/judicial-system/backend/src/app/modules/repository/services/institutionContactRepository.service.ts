import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  DefendantNotificationType,
  IndictmentCaseNotificationType,
} from '@island.is/judicial-system/types'

import { InstitutionContact } from '../models/institutionContact.model'

@Injectable()
export class InstitutionContactRepositoryService {
  constructor(
    @InjectModel(InstitutionContact)
    private readonly institutionContactModel: typeof InstitutionContact,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getInstitutionContact(
    institutionId: string,
    notificationType:
      | IndictmentCaseNotificationType
      | DefendantNotificationType,
  ): Promise<string | null> {
    try {
      this.logger.debug('Getting institution contact', {
        institutionId,
        notificationType,
      })

      if (!institutionId) {
        this.logger.debug('No institution ID provided')
        return null
      }

      const institutionContact = await this.institutionContactModel.findOne({
        where: {
          institutionId,
          type: notificationType,
        },
      })

      const contactValue = institutionContact?.value ?? null

      this.logger.debug(
        `Institution contact ${
          contactValue ? 'found' : 'not found'
        } for institutionId: ${institutionId} and type: ${notificationType}`,
      )

      return contactValue
    } catch (error) {
      this.logger.error(
        `Failed to get institution contact for institutionId: ${institutionId} and type: ${notificationType}`,
        { error },
      )

      return null
    }
  }
}
